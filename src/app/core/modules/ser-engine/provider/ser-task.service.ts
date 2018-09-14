import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ISerEngineConfig } from '@core/modules/ser-engine/api/ser-engine-config.interface';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { Observable } from 'rxjs';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class SerTaskService {

    private httpClient: HttpClient;

    private senseConfig: ISerEngineConfig;

    private filterService: SerFilterService;

    public constructor(
        @Inject('SerEngineConfig') senseConfig: ISerEngineConfig,
        httpClient: HttpClient,
        serFilterService: SerFilterService
    ) {
        this.httpClient = httpClient;
        this.senseConfig = senseConfig;
        this.filterService  = serFilterService;
    }

    /**
     * fetch all tasks
     *
     * @memberof SerTaskApiService
     */
    public fetchAllTasks() {
    }

    /**
     * fetch all tasks for an app
     *
     * @param {string} appId
     * @param {*} filter
     * @memberof SerTaskApiService
     */
    public fetchTasksForApp(appId: string): Observable<ITask[]> {

        const endpoint = `/${this.senseConfig.virtualProxy}qrs/reloadtask/full`;

        let url;
        /// #if ! DEV
            url = endpoint;
        /// #else
            url = `https://${this.senseConfig.host}/${endpoint}`;
        /// #endif

        const filter = this.filterService.createFilter('app.id', appId);

        return this.httpClient.get(url,
            {
                params: {
                    filter: this.filterService.createFilterQueryString(filter)
                },
                withCredentials: true
            }
        )
        .pipe(
            map( (response: ITask[]) => {
                return response;
            })
        );
    }
}
