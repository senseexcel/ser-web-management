import { Component, OnInit } from '@angular/core';
import { FormService } from '@core/modules/form-helper';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';
import { TaskFactoryService } from '@core/modules/ser-task/services/task-factory.service';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { TaskFormModel } from '../../model/task-form.model';
import { SerAppService } from '@core/modules/ser-engine/provider/ser-app.provider';
import { IQrsApp } from '@core/modules/ser-engine/api/response/qrs/app.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { IQlikApp } from '@apps/api/app.interface';
import { CustomPropertyProvider } from '@core/modules/ser-engine/provider/custom-property.providert';

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

    /**
     * taskmanager service to fetch tasks
     *
     * @private
     * @type {TaskManagerService}
     * @memberof EditComponent
     */
    private taskManagerService: TaskManagerService;

    private taskApiService: SerTaskService;

    private customPropertyProvider: CustomPropertyProvider;

    private activeRoute: ActivatedRoute;

    /**
     *Creates an instance of EditComponent.
     * @param {FormService<ITask, any>} formHelperService
     * @param {ActivatedRoute} rote
     * @memberof EditComponent
     */
    constructor(
        customPropertyProvider: CustomPropertyProvider,
        formHelperService: FormService<TaskFormModel, any>,
        taskManagerService: TaskManagerService,
        taskApiService: SerTaskService,
        taskFactoryService: TaskFactoryService,
        appApiService: SerAppService,
        activatedRoute: ActivatedRoute
    ) {
        this.customPropertyProvider = customPropertyProvider;
        this.formHelperService  = formHelperService;
        this.taskManagerService = taskManagerService;
        this.taskFactoryService = taskFactoryService;
        this.activeRoute        = activatedRoute;
        this.appApiService = appApiService;
        this.taskApiService = taskApiService;

        this.taskFormModel = new TaskFormModel();
    }

    /**
     * component get initialized, check activated route to
     * get current action, new or edit
     *
     * @memberof EditComponent
     */
    ngOnInit() {
        this.activeRoute.data
            .pipe(
                switchMap((data: Data) => {
                    if (data.action === 'create') {
                        return this.initNewTask();
                    } else {
                        return this.initExistingTask();
                    }
                })
            )
            .subscribe(() => {
                this.formHelperService.loadModel(this.taskFormModel);
            });
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
                // tell the breadcrumb service to go back one step
            });
    }

    /**
     * cancel edit
     * @todo implement
     *
     * @memberof EditComponent
     */
    public onCancel() {
    }

    private buildFormModel() {
        this.taskFormModel.isNew = true;
        this.taskFormModel.task = this.taskFactoryService.buildTask();
    }

    /**
     * initialize an existing task
     *
     * @private
     * @returns {Observable<any>}
     * @memberof EditComponent
     */
    private initExistingTask(): Observable<any> {

        return this.activeRoute.params
            .pipe(
                switchMap((params) => {
                    const id = params.id;
                    return this.taskApiService.fetchTask(id);
                }),
                mergeMap((task: ITask) => {
                    this.taskFormModel.isNew = false;
                    this.taskFormModel.task  = this.taskFactoryService.buildTask(task);

                    return this.appApiService.fetchSerApps();
                }),
                map((apps: IQrsApp[]) => {
                    this.taskFormModel.apps = apps;
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

        return this.appApiService.fetchSerApps()
            .pipe(
                map((apps: IQrsApp[]) => {
                    this.taskFormModel.apps = apps;
                    this.taskFormModel.isNew = true;
                    this.taskFormModel.task = this.taskFactoryService.buildTask();
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

        return this.createTaskData().pipe(
            mergeMap((task: ITask) => {

                return forkJoin(
                    this.taskApiService.fetchTask(this.taskFormModel.task.id),
                    this.taskApiService.fetchSchemaEvent(this.taskFormModel.task.id)
                ).pipe(
                    switchMap((source) => {
                        const sourceTask = source[0];
                        const schemaEvent = source[1];

                        task.id = sourceTask.id;
                        task.modifiedDate = sourceTask.modifiedDate;

                        const event = schemaEvent[0];
                        const startDate = new Date();

                        startDate.setHours(this.taskFormModel.task.trigger.hour || 12);
                        startDate.setMinutes(0);
                        startDate.setSeconds(0);
                        startDate.setMilliseconds(0);

                        event.startDate = startDate.toISOString();

                        return this.taskApiService.updateTask({
                            task,
                            schemaEvents: [event]
                        });
                    })
                );
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

        return this.createTaskData().pipe(
            switchMap((task: ITask) => {
                return this.taskApiService.createTask({
                    task,
                    schemaEvents: [
                        this.taskFactoryService.createSchemaEvent(this.taskFormModel.task.trigger.hour || 12)
                    ]
                });
            })
        );
    }

    /**
     * create default task data for update and create
     *
     * @private
     * @returns {Observable<ITask>}
     * @memberof EditComponent
     */
    private createTaskData(): Observable<ITask> {

        const taskName = this.taskFormModel.task.identification.name;
        const app      = this.taskFormModel.task.app;

        return this.customPropertyProvider.fetchCustomProperties().pipe(
            map((prop) => {

                /** qlik app data */
                const qApp: IQlikApp = { qDocId  : app.id, qDocName: app.name };

                /** create new task data which we could save now */
                const newTask = {
                    ...this.taskFactoryService.createDefaultTaskData(taskName, qApp),
                    ...this.taskFormModel.task.execution.raw
                };

                newTask.customProperties.push({
                    value: 'sense-excel-reporting-task',
                    definition: prop[0],
                    schemaPath: 'CustomPropertyValue'
                });

                return newTask;
            })
        );
    }
}
