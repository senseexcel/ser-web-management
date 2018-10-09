
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISerEngineConfig } from '@core/modules/ser-engine/api/ser-engine-config.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';

@Injectable()
export class SerUserService {

    private httpClient: HttpClient;

    private senseConfig: ISerEngineConfig;

    private filterService: SerFilterService;

    public constructor(
        @Inject('SerEngineConfig') senseConfig: ISerEngineConfig,
        httpClient: HttpClient,
        filterService: SerFilterService
    ) {
        this.httpClient = httpClient;
        this.senseConfig = senseConfig;
        this.filterService = filterService;
    }

    /**
     * fetch all tasks
     *
     * @memberof SerTaskApiService
     */
    public fetchUsers(filter): Observable<any[]> {
        const url = this.buildUrl('');
        let params: HttpParams = new HttpParams();

        if (filter) {
            params = params.set('filter', this.filterService.createFilterQueryString(filter));
        }

        return this.httpClient.get(url, {params})
        .pipe(
            map( (response: any[]) => {
                return response;
            })
        );
    }

    /**
     * build url
     *
     * @private
     * @returns {string}
     * @memberof SerTaskService
     */
    private buildUrl(action: string): string {
        return `/${this.senseConfig.virtualProxy}qrs/user/${action}`;
    }
}
