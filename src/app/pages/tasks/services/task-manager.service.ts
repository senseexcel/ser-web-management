import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ITask, TaskRepository } from '@smc/modules/qrs';

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
     *Creates an instance of TaskManagerService.
     * @memberof TaskManagerService
     */
    constructor(
        private taskRepository: TaskRepository
    ) {
        this.selectedTasks  = new BehaviorSubject<ITask[]>([]);
        this.loadedTasks    = new BehaviorSubject<ITask[]>([]);
        this.taskCache = [];
    }

    /**
     * add task
     */
    public addTask(task: ITask) {
        this.taskCache.push(task);
        this.loadedTasks.next(Array.from(this.taskCache));
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

    /**
     * synchronize tasks and add ser tag to this
     *
     * @returns
     * @memberof TaskManagerService
     */
    public syncTasks() {
        return this.taskRepository
            .synchronizeTasks();
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
            source = this.taskRepository.fetchAllTasks();
        } else {
            source = this.taskRepository.fetchTasksForApp(appId);
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
