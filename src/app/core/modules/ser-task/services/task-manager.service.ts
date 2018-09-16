import { Injectable } from '@angular/core';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { switchMap } from 'rxjs/operators';

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
     * all loaded tasks
     *
     * @type {BehaviorSubject<ITask[]>}
     * @memberof TaskManagerService
     */
    private readonly loadedAppTasks: BehaviorSubject<ITask[]>;

    /**
     * indicator tasks have allready been loaded
     *
     * @private
     * @type {false}
     * @memberof TaskManagerService
     */
    private tasksLoaded = false;

    /**
     * indicator app tasks has been loaded
     *
     * @private
     * @type {false}
     * @memberof TaskManagerService
     */
    private appTasksLoaded = false;

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
        this.loadedAppTasks = new BehaviorSubject<ITask[]>([]);

        this.taskApiService = taskApiService;
    }

    /**
     * load tasks
     *
     * @param {string} [appId]
     * @memberof TaskManagerService
     */
    public loadTasks(appId?: string) {

        if ( appId ) {
            return this.appTasksLoaded ? this.loadedAppTasks : this.fetchTasks(appId);
        }
        return this.tasksLoaded ? this.loadedTasks : this.fetchTasks();
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

    /**
     * update task
     *
     * @param {string} id
     * @param {ITask} data
     * @memberof TaskManagerService
     */
    public updateTask(id: string, data: ITask): Observable<ITask[]> {
        return this.taskApiService.updateTask(data);
    }

    /**
     *
     *
     * @private
     * @memberof TaskManagerService
     */
    private fetchTasks(appId?: string): Observable<ITask[]> {

        if (!appId) {
            return this.taskApiService.fetchAllTasks()
                .pipe(
                    switchMap( (tasks: ITask[]) => {
                        this.tasksLoaded = true;
                        this.loadedTasks.next(tasks);
                        return this.loadedTasks;
                    })
                );
        }

        return this.taskApiService.fetchTasksForApp(appId)
            .pipe(
                switchMap((tasks: ITask[]) => {
                    this.appTasksLoaded = true;
                    this.loadedAppTasks.next(tasks);
                    return this.loadedAppTasks;
                })
            );
    }
}
