import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { IFile } from '../api/file.interface';
import { IContentLibrary } from '../api/content-library.interface';
import { ILibrary } from '../api/library.interface';

export class ContentLibrary implements IContentLibrary {

    public deleted$: Subject<boolean> = new Subject();

    public fileUploaded$: Subject<string> = new Subject();

    public fileRemoved$: Subject<any> = new Subject();

    private http: HttpClient;

    private contentlibData: ILibrary;

    constructor(http: HttpClient, data: ILibrary) {
        this.contentlibData = data;
        this.http = http;
    }

    /**
     * create file with default content in content library
     */
    public createFile(name: string, content = ''): Observable<string> {
        const uploadFile = new Blob([content], { type: 'text/plain' });
        return this.uploadFile(name, uploadFile, true).pipe(
            tap((uploadedFile) => this.fileUploaded$.next(uploadedFile))
        );
    }

    /**
     * gets a file reference
     */
    public fetchFile(fileName: string): IFile {
        const files = this.contentlibData.references.filter((file: IFile) => {
            const p: RegExp = new RegExp(`${fileName}$`);
            if (file.logicalPath.match(p)) {
                return true;
            }
            return false;
        });
        return files[0] || null;
    }

    /**
     * checks file exists
     */
    public fileExists(name: string): Observable<boolean> {
        return of(this.fetchFile(name)).pipe(switchMap((file) => {
            if (file) {
                // send additional head request to check file exists not only in db
                return this.http.head(file.logicalPath).pipe(
                    map(() => true),
                    catchError(() => of(false))
                );
            }
            return of(false);
        }));
    }

    /**
     * upload content library meta data
     */
    public update(data: ILibrary): void {
        this.contentlibData = data;
    }

    /**
     * upload and override file in content library
     */
    public updateFile(filename: string, content: string): Observable<string> {
        const blob = new Blob([content], { type: 'text/plain' });
        return this.uploadFile(filename, blob, true);
    }

    /**
     * read contents of a file
     */
    public readFile(file: IFile): Observable<string> {
        const fileLoad$ = this.http.get(file.logicalPath, { responseType: 'blob' as 'json' });
        return fileLoad$.pipe(
            switchMap((content: Blob) => this.createFileReader(content))
        );
    }

    /**
     * upload given file to content library with specific file name
     */
    private uploadFile(fileName: string, content: Blob, overwrite = false): Observable<string> {
        const formData = this.createFileFormData(fileName, content);
        const url = `/qrs/contentLibrary/${this.contentlibData.name}/uploadfile`;
        const params = new HttpParams()
            .set('externalpath', fileName)
            .set('overwrite', String(overwrite));

        return this.http.post<string>(url, formData, { params });
    }

    /**
     * create file reader stream to fetch content from file
     */
    private createFileReader(bin: Blob): Observable<string> {
        const fileReader$ = new Observable<string>(obs => {
            const reader = new FileReader();
            reader.onerror = err => obs.error(err);
            reader.onabort = err => obs.error(err);
            reader.onload = () => obs.next(reader.result as string);
            reader.onloadend = () => obs.complete();
            return reader.readAsText(bin);
        });
        return fileReader$;
    }

    /**
     * create form data which could uploaded with post
     */
    private createFileFormData(name: string, data: Blob): FormData {
        const formData = new FormData();
        formData.append('file', data, `${name}`);
        return formData;
    }
}
