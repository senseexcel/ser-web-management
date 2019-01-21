import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { IContentLibResponse, IContentLibFileReference } from '../api/response/content-lib.interface';
import { ContentLibNotExistsException } from '../api/exceptions';
import { Observable } from 'rxjs';
import { FilterFactory } from '@smc/modules/qrs';

@Injectable()
export class ContentLibService {

    private http: HttpClient;

    constructor(
        private filterFactory: FilterFactory,
        http: HttpClient,
    ) {
        this.http = http;
    }

    /**
     * fetch content library for sense excel reporting
     *
     * @param {string} [name='senseexcel']
     * @throws {ContentLibNotExistsException}
     * @returns {Observable<IContentLibResponse>}
     * @memberof ContentLibService
     */
    public fetchContentLibrary(name = 'senseexcel'): Observable<IContentLibResponse> {

        const filter = this.filterFactory.createFilter('name', `'${name}'`);
        const params = new HttpParams().set('filter', this.filterFactory.createFilterQueryString(filter));

        return this.http.get('/qrs/contentLibrary/full', {params})
            .pipe(
                map((response: IContentLibResponse[]) => {
                    if (!response.length) {
                        throw new ContentLibNotExistsException(`Content Library ${name} not found.`);
                    }
                    return response[0];
                }),
            );
    }

    /**
     *
     *
     * @param {string} fileName
     * @param {Blob} content
     * @memberof ContentLibService
     */
    public uploadFile(fileName: string, content: Blob, overwrite = false): Observable<string> {

        return this.createFileFormData(fileName, content)
            .pipe(
                switchMap((formData: FormData) => {
                    const url = '/qrs/contentLibrary/senseexcel/uploadfile';
                    const params = new HttpParams()
                        .set('externalpath', fileName)
                        .set('overwrite', String(overwrite));

                    return this.http.post(url, formData, {params})
                        .pipe(map(created => String(created)));
                })
            );
    }

    /**
     *
     *
     * @param {IContentLibFileReference} file
     * @memberof ContentLibService
     */
    public readFile(file: IContentLibFileReference): Observable<string> {

        return this.http.get(file.logicalPath, {
            responseType: 'blob'
        }).pipe(
            switchMap((content: Blob) => {
                return Observable.create((obs) => {
                    const fileReader = new FileReader();
                    fileReader.readAsText(content);

                    fileReader.onabort   = err  => obs.error(err);
                    fileReader.onerror   = err  => obs.error(err);
                    fileReader.onload    = () => obs.next(fileReader.result);
                    fileReader.onloadend = () => obs.complete();
                });
            })
        );
    }

    /**
     * create form data which could uploaded with post
     *
     * @private
     * @param {string} name
     * @param {Blob} data
     * @returns {Observable<any>}
     * @memberof ContentLibService
     */
    private createFileFormData(name: string, data: Blob): Observable<FormData> {

        const fileReader$ = Observable.create( obs => {
            const reader = new FileReader();
            reader.onerror   = err => obs.error(err);
            reader.onabort   = err => obs.error(err);
            reader.onload    = ()  => obs.next(reader.result);
            reader.onloadend = ()  => obs.complete();
            return reader.readAsText(data);
        });

        /** after blob content has been loaded add to form data object */
        fileReader$.pipe(map(content => {
            const formData = new FormData();
            formData.append('file', String(content), 'license.txt');
            return formData;
        }));

        return fileReader$;
    }
}
