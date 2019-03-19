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

    public update(data: ILibrary): void {
        this.contentlibData = data;
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
     * upload given file to content library with specific file name
     */
    public uploadFile(fileName: string, content: Blob, overwrite = false): Observable<string> {
        return this.createFileFormData(fileName, content).pipe(
            switchMap((formData: FormData) => {
                const url = `/qrs/contentLibrary/${this.contentlibData.name}/uploadfile`;
                const params = new HttpParams()
                    .set('externalpath', fileName)
                    .set('overwrite', String(overwrite));

                return this.http.post<string>(url, formData, { params }).pipe(
                    tap((file) => this.fileUploaded$.next(file))
                );
            })
        );
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
     * create file with default content in content library
     */
    public createFile(name: string, content = ''): Observable<string> {
        const uploadFile = new Blob([content], { type: 'text/plain' });
        return this.uploadFile(name, uploadFile, true);
    }

    /**
     * read contents of a file
     */
    public readFile(file: IFile): Observable<string | ArrayBuffer> {
        const fileLoad$ = this.http.get(file.logicalPath, { responseType: 'blob' as 'json' });
        return fileLoad$.pipe(
            switchMap((content: Blob) => this.createFileReader(content))
        );
    }

    /**
     * create file reader stream to fetch content from file
     */
    private createFileReader(bin: Blob): Observable<string | ArrayBuffer> {
        const fileReader$ = new Observable<string | ArrayBuffer>(obs => {
            const reader = new FileReader();
            reader.onerror = err => obs.error(err);
            reader.onabort = err => obs.error(err);
            reader.onload = () => obs.next(reader.result);
            reader.onloadend = () => obs.complete();
            return reader.readAsText(bin);
        });
        return fileReader$;
    }

    /**
     * create form data which could uploaded with post
     */
    private createFileFormData(name: string, data: Blob): Observable<FormData> {
        const fileReader$ = this.createFileReader(data);
        /** after blob content has been loaded add to form data object */
        return fileReader$.pipe(map(content => {
            const formData = new FormData();
            formData.append('file', String(content), `${name}`);
            return formData;
        }));
    }
}
