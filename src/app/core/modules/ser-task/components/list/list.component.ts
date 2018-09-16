import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-ser-task-list',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss', 'table.scss'],
})

export class ListComponent implements OnDestroy, OnInit {

    /**
     * all tasks which are loaded for app
     *
     * @type {ITask[]}
     * @memberof TasksComponent
     */
    public tasks: ITask[];

    /**
     * table header fields
     *
     * @type {string[]}
     * @memberof TasksComponent
     */
    public tableHeaderFields: string[];

    /**
     * selected tasks
     *
     * @type {SelectionModel<ITask>}
     * @memberof TasksComponent
     */
    public selection: SelectionModel<ITask>;

    /**
     * app manager service to get selected apps
     *
     * @private
     * @type {SerAppManagerService}
     * @memberof ListComponent
     */
    private appManagerService: SerAppManagerService;

    /**
     * current router service
     *
     * @private
     * @type {Router}
     * @memberof ListComponent
     */
    private router: Router;

    /**
     * activated route
     *
     * @private
     * @type {ActivatedRoute}
     * @memberof ListComponent
     */
    private route: ActivatedRoute;

    /**
     * task manager service to load tasks from cache or make qrs request
     *
     * @private
     * @type {TaskManagerService}
     * @memberof ListComponent
     */
    private taskManagerService: TaskManagerService;

    /**
     * submits true if component is destroyed to unregister from
     * subscriptions
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof ListComponent
     */
    private isDestroyed$: Subject<boolean>;

    /**
     *Creates an instance of ListComponent.
     * @param {SerAppManagerService} appManager
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {TaskManagerService} taskManagerService
     * @memberof ListComponent
     */
    constructor(
        appManager: SerAppManagerService,
        router: Router,
        route: ActivatedRoute,
        taskManagerService: TaskManagerService
    ) {
        this.route = route;
        this.router = router;
        this.appManagerService  = appManager;
        this.taskManagerService = taskManagerService;
        this.isDestroyed$       = new Subject<boolean>();

        this.tasks = [];
        this.selection = new SelectionModel<ITask>();
    }

    /**
     * if component get destroyed submit true for unsubscribe subject
     *
     * @memberof ListComponent
     */
    public ngOnDestroy() {
        this.isDestroyed$.next(true);
    }

    /**
     * on component is initialized create table fields
     * and fetch all tasks
     *
     * @memberof ListComponent
     */
    public ngOnInit() {
        this.tableHeaderFields = ['id', 'name', 'enabled', 'status', 'lastExecution', 'nextExecution', 'tags'];

        const selectedApp = null; // this.appManagerService.getSelectedApps()[0] || null;
        this.fetchTasks(selectedApp ? selectedApp.qDocId : null);
    }

    /**
     * select task
     *
     * @param {ITask} task
     * @memberof ListComponent
     */
    public selectTask(task: ITask) {
        this.selection.select(task);
        this.taskManagerService.selectTasks([task]);
    }

    /**
     * edit current selected task
     *
     * @memberof ListComponent
     */
    public editTask() {
        const task = this.selection.selected[0];
        this.router.navigate([`edit/${task.id}`], { relativeTo: this.route});
    }

    /**
     * delete a task
     * @todo implement
     *
     * @memberof ListComponent
     */
    public deleteTask() {}

    /**
     * start task
     * @todo implement
     *
     * @memberof ListComponent
     */
    public startTask() {}

    /**
     * stop task
     * @todo implement
     *
     * @memberof ListComponent
     */
    public stopTask() {}

    /**
     * reload task list
     *
     * @memberof ListComponent
     */
    public reloadList() {}

    /**
     * create new task
     * @todo implement
     *
     * @memberof ListComponent
     */
    public createNew() {}

    /**
     * get all tasks for specific app id
     *
     * @private
     * @param {string} appId
     * @memberof TasksComponent
     */
    private fetchTasks(appId: string) {

        appId = 'ba16ebd1-1e3d-44f3-8450-ae7bd77435d3';

        this.taskManagerService.loadTasks(appId)
            .pipe(
                takeUntil(this.isDestroyed$)
            )
            .subscribe( (tasks: ITask[]) => {
                this.tasks = tasks;
            });
    }
}
