import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FilterFactory } from './filter.factory';
import { Observable, from, concat, forkJoin, of, empty } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { IQrsFilter, IQrsFilterGroup, IApp } from '../api';
import { switchMap, reduce, mergeMap, combineAll, take, bufferCount, catchError } from 'rxjs/operators';
import { ITask } from '../api';
import { SMC_SETTINGS } from '@smc/modules/common/model/settings.model';
import { ISettings } from '@smc/modules/common';
import { AppRepository } from './app.repository';

@Injectable()
export class TaskRepository {

    private httpClient: HttpClient;

    private filterService: FilterFactory;

    public constructor(
        @Inject(SMC_SETTINGS) private settings: ISettings,
        private appRepository: AppRepository,
        httpClient: HttpClient,
        serFilterService: FilterFactory
    ) {
        this.httpClient = httpClient;
        this.filterService  = serFilterService;
    }

    /**
     * fetch all tasks
     *
     * @memberof SerTaskApiService
     */
    public fetchAllTasks(): Observable<ITask[]> {

        let taskSource$: Observable<ITask[]>;

        if (this.settings.serTag) {
            /**
             * tag exists in this case we can filter by Tag SER this will be fastest
             */
            const tagFilter = this.filterService.createFilter('tags.id', this.settings.serTag.id);
            const url = this.buildUrl('full');

            taskSource$ = this.httpClient.get(url, {
                withCredentials: true,
                params: {
                    filter: this.filterService.createFilterQueryString(tagFilter)
                }
            })
            .pipe(
                map( (response: ITask[]) => {
                    return response;
                })
            );
        } else {
            /**
             * no tag available, in this case we need to check all ser apps
             * and get tasks for ser apps could be very slow
             */
            taskSource$ = this.appRepository.fetchSerApps()
                .pipe(
                    switchMap(apps => from(apps).pipe(
                        mergeMap( (app: IApp) => this.fetchTasksForApp(app.id)))
                    ),
                    reduce((appTasks: ITask[], allTasks: ITask[]) => {
                        return allTasks.concat(appTasks);
                    })
                );
        }
        return taskSource$;
    }
    /**
     * sync tasks and add SER tag
     * have to return a number
     *
     * @memberof SerTaskService
     */
    public synchronizeTasks() {

        return this.appRepository.fetchSerApps(false).pipe(
            switchMap((apps) => {
                if (apps.length === 0) {
                    throw new Error('no apps found');
                }
                return from(apps).pipe(
                    mergeMap((app: IApp) => this.fetchTasksForApp(app.id, true)),
                );
            }),
            reduce((appTasks: ITask[], allTasks: ITask[]) => {
                return allTasks.concat(appTasks);
            }),
            switchMap((tasks) => {
                if (tasks.length === 0) {
                    throw new Error('no tasks found');
                }
                return from(tasks).pipe(
                    map(task => {
                        task.tags.push(this.settings.serTag);
                        return this.updateTask(task);
                    })
                );
            }),
            combineAll(),
            catchError((error) => {
                console.error(error);
                return of([]);
            })
        );
    }

    public fetchTask(taskId: string): Observable<any> {
        const url = this.buildUrl(taskId);
        return this.httpClient.get(url);
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
     * fetch all schema events
     *
     * @param {string} taskId
     * @returns {Observable<any>}
     * @memberof SerTaskService
     */
    public fetchSchemaEvent(taskId: string): Observable<any> {

        const url = '/qrs/schemaevent/full';
        const propFilter = this.filterService.createFilter('reloadTask.id', taskId);

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
    public createTask(taskDefinition: ITask): Observable<any> {
        const url = this.buildUrl('create');
        return this.httpClient.post(url, taskDefinition, { withCredentials: true });
    }

    /**
     * fetch all tasks for an app
     *
     * @param {string} appId
     * @param {*} filter
     * @memberof SerTaskApiService
     */
    public fetchTasksForApp(appId: string, ignoreTag = false): Observable<ITask[]> {

        const url = this.buildUrl('full');

        const filterGroup: IQrsFilterGroup = this.filterService.createFilterGroup();
        filterGroup.addFilter(this.filterService.createFilter('app.id', appId));

        if (this.settings.serTag && !ignoreTag) {
            filterGroup.addFilter(
                this.filterService.createFilter('tags.id', this.settings.serTag.id));
        }

        return this.httpClient.get(url, {
                params: {
                    filter: this.filterService.createFilterQueryString(filterGroup)
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
    public updateTask(taskDefinition: ITask): Observable<ITask> {
        const url = this.buildUrl('update');

        return this.httpClient.post(url, taskDefinition, {
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
        return `/qrs/reloadtask/${action}`;
    }
}
