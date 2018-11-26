import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormService } from '@core/modules/form-helper';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { switchMap, catchError, map, mergeMap, filter, tap } from 'rxjs/operators';
import { of, Observable, forkJoin, from, empty } from 'rxjs';
import { TaskFactoryService } from '@core/modules/ser-task/services/task-factory.service';
import { ActivatedRoute, Data, Router, Params } from '@angular/router';
import { TaskFormModel } from '../../model/task-form.model';
import { SerAppService } from '@core/modules/ser-engine/provider/ser-app.provider';
import { IQrsApp } from '@core/modules/ser-engine/api/response/qrs/app.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { IQlikApp } from '@apps/api/app.interface';
import { AppData } from '@core/model/app-data';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { IDataNode } from '@core/api/model.interface';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { TaskIncomatibleException } from '../../api/exceptions/incompatible.exception';

@Component({
    selector: 'app-task-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
    providers: [FormService]
})

export class EditComponent implements OnInit {

    /**
     * all tasks which should be edited
     *
     * @type {ITask[]}
     * @memberof EditComponent
     */
    public tasks: ITask[];

    /**
     *
     *
     * @type {string[]}
     * @memberof EditComponent
     */
    public properties: IDataNode[];

    public formDataLoaded = false;

    public selectedProperty: any;

    private modalService: ModalService;

    private taskFormModel: TaskFormModel;

    /**
     * form helper service
     *
     * @private
     * @type {FormService<ITask, any>}
     * @memberof EditComponent
     */
    private formHelperService: FormService<TaskFormModel, any>;

    /**
     * task service to create and update task models
     *
     * @private
     * @type {TaskService}
     * @memberof EditComponent
     */
    private taskFactoryService: TaskFactoryService;
    private appApiService: SerAppService;
    private taskApiService: SerTaskService;
    private activeRoute: ActivatedRoute;
    private appData: AppData;
    private location: Location;

    @ViewChild('identification')
    private identificationContainer: ElementRef;

    @ViewChild('execution')
    private executionContainer: ElementRef;

    @ViewChild('trigger')
    private triggerContainer: ElementRef;

    /**
     *Creates an instance of EditComponent.
     * @param {FormService<ITask, any>} formHelperService
     * @param {ActivatedRoute} rote
     * @memberof EditComponent
     */
    constructor(
        @Inject('AppData') appData: AppData,
        private appManager: SerAppManagerService,
        private router: Router,
        activatedRoute: ActivatedRoute,
        appApiService: SerAppService,
        formHelperService: FormService<TaskFormModel, any>,
        location: Location,
        modalService: ModalService,
        taskApiService: SerTaskService,
        taskFactoryService: TaskFactoryService,
    ) {
        this.activeRoute        = activatedRoute;
        this.appApiService      = appApiService;
        this.appData            = appData;
        this.formHelperService  = formHelperService;
        this.modalService       = modalService;
        this.location           = location;
        this.taskApiService     = taskApiService;
        this.taskFactoryService = taskFactoryService;
        this.taskFormModel      = new TaskFormModel();
    }

    /**
     * component get initialized, check activated route to
     * get current action, new or edit
     *
     * @memberof EditComponent
     */
    ngOnInit() {

        this.properties = [
            { label: 'Identification' },
            { label: 'Execution' },
            { label: 'Trigger' },
        ];

        this.activeRoute.data
            .pipe(
                switchMap((data: Data) => {

                    let source$: Observable<any> = empty();

                    if (data.action === 'create') {
                        source$ = this.initNewTask();
                    } else {
                        source$ = this.initExistingTask();
                    }

                    if (data.isApp && data.action === 'create') {
                        source$ = source$.pipe(
                            switchMap(() => this.activeRoute.parent.params),
                            switchMap((params: Params) => {
                                return this.appApiService.fetchApp(params.id);
                            }),
                            tap((app: IQrsApp) => {
                                this.taskFormModel.task.app = app;
                                this.taskFormModel.task.identification.app = app.id;
                            })
                        );
                    }
                    return source$;
                }),
            )
            .subscribe(
                // success
                () => {
                    this.formHelperService.loadModel(this.taskFormModel);
                    this.formDataLoaded = true;
                },
                // error
                (error) => {
                    let message = 'An error occured on open the task. Please check logs for detailed informations.';
                    let title = 'Could not open Task';

                    if (error instanceof TaskIncomatibleException) {
                        title = 'Task Incompatible';
                        message = `It seems the task was created or modified by qmc and could not edited with webmanagement app.`;
                    } else {
                        console.error(error);
                    }

                    this.modalService.openMessageModal(title, message)
                        .onClose.subscribe(() => {
                            this.router.navigate(['.'], {
                                relativeTo: this.activeRoute.parent
                            });
                        });
                }
            );
    }

    /**
     * apply form data and save to task model
     *
     * @memberof EditComponent
     */
    public onApply() {
        this.formHelperService.updateModel()
            .pipe(
                switchMap(() => {
                    if (this.taskFormModel.isNew) {
                        return this.createNewtask();
                    }
                    return this.updateTask();
                }),
                catchError((error) => {
                    console.error(error);
                    return of(null);
                })
            )
            .subscribe((task: ITask) => {
                let title: string;
                let message: string;

                if (task) {
                    title   = `Task ${this.taskFormModel.isNew ? 'created' : 'updated'} !`;
                    message = `Task ${this.taskFormModel.task.identification.name} was successfully saved.`;
                    this.modalService.openMessageModal(title, message)
                        .onClose.subscribe(() => {
                            const path = this.activeRoute.parent.routeConfig.path;
                            this.router.navigate(['edit', task.id], {
                                relativeTo: this.activeRoute.parent
                            });
                        });
                } else {
                    title   = `An error occurred.`;
                    message = `Task ${this.taskFormModel.task.identification.name} could not saved.`;
                    this.modalService
                        .openMessageModal(title, message);
                }
            });
    }

    public showForm(property) {

        let scrollToContainer: ElementRef;

        switch (property.label.toLowerCase()) {
            case 'identification':
                scrollToContainer = this.identificationContainer;
                break;
            case 'execution':
                scrollToContainer = this.executionContainer;
                break;
            case 'trigger':
                scrollToContainer = this.triggerContainer;
                break;
            default:
                return;
        }

        scrollToContainer.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        this.selectedProperty = property;
    }

    /**
     * cancel edit
     * @todo implement
     *
     * @memberof EditComponent
     */
    public onCancel() {
        const title = `Warning`;
        const message = `Cancel current process will discard all current changes.\n\nContinue ?`;

        this.modalService.openDialog(title, message)
            .switch.subscribe((confirm) => {
                if (confirm) {
                    this.location.back();
                }
            });
    }

    /**
     * initialize an existing task
     *
     * @private
     * @returns {Observable<any>}
     * @memberof EditComponent
     */
    private initExistingTask(): Observable<TaskFormModel> {

        return this.activeRoute.params
            .pipe(
                switchMap((params) => {
                    const id = params.id;
                    return this.taskApiService.fetchTask(id);
                }),
                switchMap((task: ITask) => {
                    this.tasks = [task];
                    this.taskFormModel.isNew = false;
                    return this.taskFactoryService.buildTask(task);
                }),
                switchMap((taskModel) => {
                    this.taskFormModel.task  = taskModel;
                    return this.appManager.loadSerApps();
                }),
                switchMap((apps: IQlikApp[]) => {
                    this.taskFormModel.apps = apps;
                    return of(this.taskFormModel);
                })
            );
    }

    /**
     * initialize a new task
     *
     * @private
     * @returns {Observable<any>}
     * @memberof EditComponent
     */
    private initNewTask(): Observable<any> {

        this.tasks = [{
            app: null,
            name: 'New Task',
        }];

        return this.appManager.loadSerApps()
            .pipe(
                switchMap((apps: IQlikApp[]) => {
                    this.taskFormModel.apps = apps;
                    this.taskFormModel.isNew = true;
                    return this.taskFactoryService.buildTask();
                }),
                tap((task) => {
                    this.taskFormModel.task = task;
                })
            );
    }

    /**
     * update a task
     *
     * @private
     * @memberof EditComponent
     */
    private updateTask(): Observable<ITask> {

        const task = this.createTaskData();

        return forkJoin(
            this.taskApiService.fetchTask(this.taskFormModel.task.id),
            this.taskApiService.fetchSchemaEvent(this.taskFormModel.task.id)
        ).pipe(
            switchMap((source) => {
                const sourceTask = source[0];
                const schemaEvent = source[1];
                const startTime   = this.taskFormModel.task.trigger.hour || 12;

                task.id = sourceTask.id;
                task.modifiedDate = sourceTask.modifiedDate;

                const event = {
                    ...schemaEvent[0],
                    ...this.taskFactoryService.createSchemaEvent(startTime, task)
                };

                return this.taskApiService.updateTask({
                    task,
                    schemaEvents: [event]
                });
            })
        );
    }

    /**
     * create new task
     *
     * @private
     * @param {*} taskName
     * @memberof EditComponent
     */
    private createNewtask(): Observable<ITask> {
        const task = this.createTaskData();
        return this.taskApiService.createTask({
            task,
            schemaEvents: [
                this.taskFactoryService.createSchemaEvent(this.taskFormModel.task.trigger.hour || 12)
            ]
        });
    }

    /**
     * create default task data for update and create
     *
     * @private
     * @returns {Observable<ITask>}
     * @memberof EditComponent
     */
    private createTaskData(): ITask {

        const taskName = this.taskFormModel.task.identification.name;
        const app      = this.taskFormModel.task.app;

        /** qlik app data */
        const qApp: IQlikApp = { qDocId  : app.id, qDocName: app.name };

        /** create new task data which we could save now */
        const newTask = {
            ...this.taskFactoryService.createDefaultTaskData(taskName, qApp),
            ...this.taskFormModel.task.execution.raw
        };

        if (this.appData.tag) {
            newTask.tags.push(this.appData.tag);
        }

        return newTask;
    }
}
