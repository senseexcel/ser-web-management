import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISerEngineConfig } from '@core/modules/ser-engine/api/ser-engine-config.interface';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { Observable } from 'rxjs';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { map } from 'rxjs/internal/operators/map';
import { IQrsFilter } from '@core/modules/ser-engine/api/filter.interface';

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
     * fetch current number of all tasks
     *
     * @returns {Observable<number>}
     * @memberof SerTaskService
     */
    public fetchTaskCount(filter?: IQrsFilter): Observable<number> {
        const url = this.buildUrl('count');
        let params: HttpParams = new HttpParams();

        if (filter) {
            params = params.set('filter', this.filterService.createFilterQueryString(filter));
        }

        return this.httpClient.get(url, {params})
            .pipe(
                map((response: {value: number}) => {
                    return response.value;
                })
            );
    }

    /**
     * create a new task
     */
    public createTask(newTask: ITask): Observable<Object> {
        const url = this.buildUrl('create');
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
        return `/${this.senseConfig.virtualProxy}qrs/reloadtask/${action}`;
    }
}
