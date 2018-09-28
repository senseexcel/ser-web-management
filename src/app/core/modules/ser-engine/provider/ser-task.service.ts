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
    public fetchAllTasks(): Observable<ITask[]> {
        const url = this.buildUrl('full');
        return this.httpClient.get(url,
            {
                withCredentials: true
            }
        )
        .pipe(
            map( (response: ITask[]) => {
                return response;
            })
        );
    }

    /**
     * create a new task
     */
    public createTask(newTask: ITask): Observable<Object> {
        const url = this.buildUrl('create')
        // const url = "https://desktop-u50tnti/ser/qrs/reloadtask/create"
        console.log(newTask);
        return this.httpClient.post(url, newTask, { withCredentials: true });
    }


    /**
     * fetch all tasks for an app
     *
     * @param {string} appId
     * @param {*} filter
     * @memberof SerTaskApiService
     */
    public fetchTasksForApp(appId: string): Observable<ITask[]> {
        const url    = this.buildUrl('full');
        const filter = this.filterService.createFilter('app.id', appId);

        return this.httpClient.get(url, {
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

    /**
     * update task
     *
     * @param {ITask} data
     * @returns
     * @memberof SerTaskService
     */
    public updateTask(data: ITask): Observable<ITask> {
        const url = this.buildUrl('update');

        return this.httpClient.post(url, { task: data }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        )
        .pipe(
            map( (response: ITask) => {
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
        const endpoint = `${this.senseConfig.virtualProxy}qrs/reloadtask/${action}`;
        let url;
        /// #if ! mode==='qmc'
            url = `/${endpoint}`;
        /// #else
            url = `https://${this.senseConfig.host}/${endpoint}`;
        /// #endif
        return url;
    }
}
