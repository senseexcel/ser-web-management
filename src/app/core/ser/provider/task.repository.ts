import { Injectable, Inject } from '@angular/core';
import { AppRepository } from './app.repository';
import { mergeMap, map, bufferCount, concatMap, filter, switchMap, tap } from 'rxjs/operators';
import { from, of, Observable, forkJoin } from 'rxjs';
import { ITask, IApp, TaskRepository as QrsTaskRepository, FilterFactory, IQrsFilter, IQrsFilterGroup, ITag } from '@smc/modules/qrs';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings } from '@smc/modules/smc-common/api';

@Injectable()
export class TaskRepository {

    constructor(
        @Inject(SMC_SESSION) private session: ISettings,
        private appRepository: AppRepository,
        private qrsTaskRepository: QrsTaskRepository,
        private filterFactory: FilterFactory
    ) { }

    public fetchTasks(_filter?: IQrsFilter): Observable<ITask[]> {
        const filters: IQrsFilterGroup = this.filterFactory.createFilterGroup();

        if (this.session.serTag) {
            filters.addFilter(this.filterFactory.createFilter('tags.id', this.session.serTag.id));
        }

        if (_filter) {
            filters.addFilter(_filter);
        }


        let task$: Observable<ITask[]> = this.qrsTaskRepository.fetchTasks(filters.filters.length ? filters : null);
        if (!this.session.serTag) {
            task$ = task$.pipe(
                mergeMap((tasks: ITask[]) => this.filterTasks(tasks))
            );
        }
        return task$;
    }

    public fetchTasksForApp(app): Observable<ITask[]> {
        const filters: IQrsFilterGroup = this.filterFactory.createFilterGroup();
        filters.addFilter(this.filterFactory.createFilter('app.id', app));

        if (this.session.serTag) {
            const serTagFilter: IQrsFilter = this.filterFactory.createFilter('tags.id', this.session.serTag.id);
            filters.addFilter(serTagFilter);
        }
        return this.qrsTaskRepository.fetchTasks(filters);
    }

    /**
     * sync tasks and add SER tag
     * have to return a number
     *
     * @memberof SerTaskService
     */
    public synchronizeTasks(): Observable<ITask[]> {

        return this.qrsTaskRepository.fetchTasks().pipe(
            // step 1: get all tasks and filter them by SER Tag
            // if task allready have an SER Tag remove it from result list
            map((tasks: ITask[]) => tasks.filter((task: ITask) =>
                task.tags.every((tag: ITag) => tag.id !== this.session.serTag.id)
            )),
            // step 2: all tasks which has been left must be filtered now
            // to check which tasks is combined with a SER App
            switchMap((tasks: ITask[]) => this.filterTasks(tasks)),
            // step 3: update all tasks
            mergeMap((tasks: ITask[]) => {
                if (tasks.length === 0) {
                    return of(tasks);
                }
                const updateRequests = tasks.map((task) => {
                    task.tags.push(this.session.serTag);
                    return this.qrsTaskRepository.updateTask({task});
                });
                return forkJoin<ITask>(...updateRequests);
            })
        );
    }

    /**
     * filter tasks for valid apps, app which has been validated
     * means the app contains a SER Script should be shown
     *
     * @private
     * @param {ITask[]} tasks
     * @returns {Observable<ITask[]>}
     * @memberof TaskRepository
     */
    private filterTasks(tasks: ITask[]): Observable<ITask[]> {

        if (tasks.length === 0) {
            return of(tasks);
        }

        return from(tasks).pipe(
            concatMap(task => forkJoin(of(task), this.appRepository.filterApps([task.app]))),
            map((response: [ITask, IApp[]]) => {
                const [task, app] = response;
                if (!app[0]) {
                    return null;
                }
                return task;
            }),
            bufferCount(tasks.length),
            map((response) => response.filter((task) => !!task))
        );
    }
}
