import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { IContentLibResponse, IContentLibFileReference } from '../api/response/content-lib.interface';
import { ContentLibNotExistsException } from '../api/exceptions';
import { Observable, of, fromEvent } from 'rxjs';

@Injectable()
export class ContentLibService {

    private http: HttpClient;

    private filterService: SerFilterService;

    constructor(
        filterService: SerFilterService,
        http: HttpClient,
    ) {
        this.filterService = filterService;
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

        const filter = this.filterService.createFilter('name', `'${name}'`);
        const params = new HttpParams().set('filter', this.filterService.createFilterQueryString(filter));

        return this.http.get('/qrs/contentLibrary/full', {params})
            .pipe(
                map((response: IContentLibResponse[]) => {
                    if (!response.length) {
                        throw new ContentLibNotExistsException(`Content Library ${name} not found.`);
                    }
                    return response[0];
                })
            );
    }

    /**
     *
     *
     * @param {string} fileName
     * @param {Blob} content
     * @memberof ContentLibService
     */
    public createFile(fileName: string, content: Blob): Observable<any> {

        return this.createFileFormData(fileName, content)
            .pipe(
                switchMap((formData: FormData) => {

                    const url = '/qrs/contentLibrary/senseexcel/uploadfile';
                    const params = new HttpParams()
                        .set('externalpath', fileName)
                        .set('overwrite', 'false');

                    const request = new HttpRequest('POST', url, formData, {
                        params
                    });

                    return this.http.request(request);
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
        return of('my license');
    }

    /**
     *
     *
     * @param {IContentLibFileReference} file
     * @memberof ContentLibService
     */
    public updateFile(file: IContentLibFileReference, data: Blob) {}

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
            return reader.readAsDataURL(data);
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
