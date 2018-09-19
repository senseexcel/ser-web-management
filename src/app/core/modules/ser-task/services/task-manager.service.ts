import { Injectable } from '@angular/core';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class TaskManagerService {

    /**
     * selected tasks
     *
     * @type {BehaviorSubject<ITask[]>}
     * @memberof TaskManagerService
     */
    public readonly selectedTasks: BehaviorSubject<ITask[]>;

    /**
     * all loaded tasks
     *
     * @type {BehaviorSubject<ITask[]>}
     * @memberof TaskManagerService
     */
    private readonly loadedTasks: BehaviorSubject<ITask[]>;

    /**
     * indicator tasks have allready been loaded
     *
     * @private
     * @type {false}
     * @memberof TaskManagerService
     */
    private tasksLoaded = false;

    /**
     * cache for all loaded tasks
     *
     * @private
     * @type {Set<ITask>}
     * @memberof TaskManagerService
     */
    private taskCache: ITask[];

    /**
     * rest api service to fetch tassks
     *
     * @private
     * @type {SerTaskService}
     * @memberof TaskManagerService
     */
    private taskApiService: SerTaskService;

    /**
     *Creates an instance of TaskManagerService.
     * @memberof TaskManagerService
     */
    constructor(
        taskApiService: SerTaskService
    ) {
        this.selectedTasks  = new BehaviorSubject<ITask[]>([]);
        this.loadedTasks    = new BehaviorSubject<ITask[]>([]);

        this.taskCache = [];

        this.taskApiService = taskApiService;
    }

    /**
     * load tasks
     *
     * @param {string} [appId]
     * @memberof TaskManagerService
     */
    public loadTasks(appId?: string) {
        return this.tasksLoaded ? this.loadedTasks : this.fetchTasks(appId);
    }

    /**
     * set selected tasks
     *
     * @param {ITask[]} tasks
     * @memberof TaskManagerService
     */
    public selectTasks(tasks: ITask[]) {
        this.selectedTasks.next(tasks);
    }

    public createTask(data: ITask) {

        this.taskApiService.createTask(name);
    }

    /**
     * update task
     *
     * @param {string} id
     * @param {ITask} data
     * @memberof TaskManagerService
     */
    public updateTask(id: string, source: ITask): Observable<ITask> {
        return this.taskApiService.updateTask(source)
            .pipe(
                tap((task: ITask) => {
                    const index = this.taskCache.indexOf(source);
                    if ( index > -1 ) {
                        this.taskCache.splice(index, 1, task);
                        this.loadedTasks.next(Array.from(this.taskCache));
                    }
                })
            );
    }

    /**
     *
     *
     * @private
     * @memberof TaskManagerService
     */
    private fetchTasks(appId?: string): Observable<ITask[]> {

        let source;

        if (!appId) {
            source = this.taskApiService.fetchAllTasks();
        } else {
            source = this.taskApiService.fetchTasksForApp(appId);
        }

        source.pipe(
                switchMap((tasks: ITask[]) => {
                    this.tasksLoaded = true;
                    this.taskCache = tasks;
                    this.loadedTasks.next(Array.from(this.taskCache));
                    return this.loadedTasks;
                })
            );

        return source;
    }
}
