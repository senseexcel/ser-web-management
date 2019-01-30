import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FilterFactory } from './filter.factory';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { IQrsFilter, IQrsFilterGroup, IApp } from '../api';
import { ITask } from '../api';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings } from '@smc/modules/smc-common';
import { ITaskDefinition } from '../api/task-definition.interface';

@Injectable()
export class TaskRepository {

    private httpClient: HttpClient;

    private filterService: FilterFactory;

    public constructor(
        @Inject(SMC_SESSION) private settings: ISettings,
        httpClient: HttpClient,
        serFilterService: FilterFactory
    ) {
        this.httpClient = httpClient;
        this.filterService  = serFilterService;
    }

    public fetchTask(taskId: string): Observable<ITask> {
        const url = `/qrs/reloadtask/${taskId}`;
        return this.httpClient.get<ITask>(url);
    }

    public fetchTasks(filter?: IQrsFilter | IQrsFilterGroup): Observable<ITask[]> {
        const url = `/qrs/reloadtask/full`;
        return this.httpClient.get<ITask[]>(url);
    }

    /**
     * fetch current number of all tasks
     *
     * @returns {Observable<number>}
     * @memberof SerTaskService
     */
    public fetchTaskCount(filter?: IQrsFilter): Observable<number> {
        const url = `/qrs/reloadtask/count`;
        let params: HttpParams = new HttpParams();

        if (filter) {
            params = params.set('filter', this.filterService.createFilterQueryString(filter));
        }

        return this.httpClient.get<{value: number}>(url, {params})
            .pipe(map(response => response.value));
    }

    /**
     * fetch all schema events
     *
     * @param {string} taskId
     * @returns {Observable<any>}
     * @memberof SerTaskService
     */
    public fetchSchemaEvent(taskId: string): Observable<any> {

        const url = '/qrs/schemaevent/full';
        const propFilter = this.filterService.createFilter('reloadTask.id', taskId);
        return this.httpClient.get(url, {
                withCredentials: true,
                params: {
                    filter: this.filterService.createFilterQueryString(propFilter)
                }
            }
        );
    }

    /**
     * fetch event by id
     *
     * @param {string} eventId
     * @returns {Observable<any>}
     * @memberof SerTaskService
     */
    public fetchEvent(eventId: string): Observable<any> {
        const url = '/qrs/event/full';
        const propFilter = this.filterService.createFilter('event.id', eventId);
        return this.httpClient.get(url,
            {
                withCredentials: true,
                params: {
                    filter: this.filterService.createFilterQueryString(propFilter)
                }
            }
        );
    }

    /**
     * create a new task
     */
    public createTask(taskDefinition: ITaskDefinition): Observable<any> {
        const url = `/qrs/ReloadTask/create`;
        return this.httpClient.post(url, taskDefinition, { withCredentials: true });
    }

    /**
     * update task
     *
     * @param {ITask} data
     * @returns
     * @memberof SerTaskService
     */
    public updateTask(taskDefinition: ITaskDefinition): Observable<ITask> {
        const url = `/qrs/reloadtask/update`;
        return this.httpClient.post<ITask>(url, taskDefinition, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
    }
}
