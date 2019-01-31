import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { Subject, empty, of, Observable } from 'rxjs';
import { ModalService } from '@smc/modules/modal';
import { ITask } from '@smc/modules/qrs';
import { TaskRepository } from '@smc/modules/ser/provider';

@Component({
    selector: 'smc-ser-task-list',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss', 'table.scss']
})

export class ListComponent implements OnDestroy, OnInit {

    public isLoading: boolean;
    public tasks: ITask[];
    public columns: string[];
    public selection: SelectionModel<ITask>;

    private isDestroyed$: Subject<boolean>;

    /**
     *Creates an instance of ListComponent.
     * @param {SerAppManagerService} appManager
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @memberof ListComponent
     */
    constructor(
        private dialog: ModalService,
        private router: Router,
        private route: ActivatedRoute,
        private taskRepository: TaskRepository
    ) {
        this.isDestroyed$ = new Subject<boolean>();
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
        this.columns = [
            'id',
            'name',
            'Associated Resource',
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
     * reload task list
     *
     * @memberof ListComponent
     */
    public reloadList() {
        this.fetchTasks();
    }

    /**
     * create new task
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
            switchMap((confirm: boolean): Observable<any> => {
                if (confirm) {
                    return this.taskRepository.synchronizeTasks();
                }
                return empty();
            }),
        )
        .subscribe((tasks: any[]) => {
            if (tasks) {
                this.dialog.openMessageModal('Tasks Synchronized', `${tasks.length} Task(s) where synchronized.`);
                this.reloadList();
            }
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
                this.isLoading = true;
                const appId = params.id || null;

                if (appId) {
                    return this.taskRepository.fetchTasksForApp(appId);
                }

                return this.taskRepository.fetchTasks();
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe( (tasks: ITask[]) => {
            this.tasks = tasks;
            this.isLoading = false;
        });
    }
}
