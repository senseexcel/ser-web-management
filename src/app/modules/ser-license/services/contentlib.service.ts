import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { map, catchError } from 'rxjs/operators';
import { IContentLibResponse } from '../api/response/content-lib.interface';
import { ContentLibNotExistsException } from '../api/exceptions';
import { Observable, of, forkJoin } from 'rxjs';

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
}
