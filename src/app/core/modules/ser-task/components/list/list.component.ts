import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { Subject, empty } from 'rxjs';
import { ListHeaderService } from '@core/modules/list-header/services/list-header.service';
import { AppData } from '@core/model/app-data';
import { ModalService } from '@core/modules/modal/services/modal.service';

@Component({
    selector: 'app-ser-task-list',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss', 'table.scss'],
    viewProviders: [ListHeaderService]
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

    public appData: AppData;

    private dialog: ModalService;

    private listHeaderService: ListHeaderService;

    /**
     *Creates an instance of ListComponent.
     * @param {SerAppManagerService} appManager
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {TaskManagerService} taskManagerService
     * @memberof ListComponent
     */
    constructor(
        @Inject('AppData') appData: AppData,
        dialog: ModalService,
        router: Router,
        route: ActivatedRoute,
        taskManagerService: TaskManagerService,
        listHeaderService: ListHeaderService
    ) {
        this.appData = appData;
        this.dialog  = dialog;
        this.route   = route;
        this.router  = router;
        this.taskManagerService = taskManagerService;
        this.isDestroyed$       = new Subject<boolean>();

        this.tasks = [];
        this.selection = new SelectionModel<ITask>();
        this.listHeaderService = listHeaderService;
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
        this.tableHeaderFields = [
            'id',
            'name',
            'enabled',
            'status',
            'lastExecution',
            'nextExecution'
        ];
        this.fetchTasks();
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
        this.listHeaderService.updateData({
            selected: this.selection.selected.length,
            showing: this.tasks.length,
            total: this.tasks.length
        });
    }

    /**
     * edit current selected task
     *
     * @memberof ListComponent
     */
    public editTask() {
        const task = this.selection.selected[0];
        this.router.navigate([`./edit/${task.id}`], { relativeTo: this.route});
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
    public createNew() {
        this.router.navigate(['new'], { relativeTo: this.route});
    }

    public syncTasks() {

       this.dialog.openDialog(
            'Synchronize Tasks',
            'This will Synchronize Sense Excel Reporting Tasks and add SER Tag to Task. This can take a while...'
        ).switch.pipe(
            switchMap((confirm: boolean) => {
                if (confirm) {
                    return this.taskManagerService.syncTasks();
                }
                return empty();
            }),
        )
        .subscribe((tasks) => {
            console.dir(tasks);
            this.dialog.openMessageModal('Tasks Synchronized', `${tasks.length} Task(s) where synchronized.`);
        });
    }

    /**
     * get all tasks for specific app id
     *
     * @private
     * @param {string} appId
     * @memberof TasksComponent
     */
    private fetchTasks() {

        this.route.params.pipe(
            switchMap((params: Params) => {
                const appId = params.id || null;
                return this.taskManagerService.loadTasks(appId);
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe( (tasks: ITask[]) => {
            this.tasks = tasks;
            this.listHeaderService.updateData({
                selected: this.selection.selected.length,
                showing: this.tasks.length,
                total: this.tasks.length
            });
        });
    }
}
