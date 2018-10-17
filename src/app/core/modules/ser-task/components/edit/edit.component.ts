import { Component, OnInit } from '@angular/core';
import { FormService } from '@core/modules/form-helper';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';
import { switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { TaskFactoryService } from '@core/modules/ser-task/services/task-factory.service';
import { ActivatedRoute } from '@angular/router';
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

        this.activeRoute.data.subscribe((data) => {

            if (data.action === 'create') {
                this.appApiService.fetchSerApps()
                    .subscribe((apps: IQrsApp[]) => {

                        this.taskFormModel.isNew = true;
                        this.taskFormModel.apps = apps;
                        this.taskFormModel.task = this.taskFactoryService.buildTask();

                        this.formHelperService.loadModel(this.taskFormModel);
                    });
                return;
            }
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
                }),
                catchError((error, caught: Observable<ITask>) => {
                    console.dir(error);
                    return of(null);
                })
            )
            .subscribe((task: ITask) => {
                if ( task ) {
                    // update current task object we have edited
                    this.tasks[0] = task;
                }
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

    /**
     * edit existing task
     *
     * @private
     * @memberof EditComponent
     */
    private editTask(task: ITask) {
    }

    /**
     * create new task
     *
     * @private
     * @param {*} taskName
     * @memberof EditComponent
     */
    private createNewtask(): Observable<ITask> {

        const taskName = this.taskFormModel.task.identification.name;
        const app      = this.taskFormModel.task.app;


        return this.customPropertyProvider.fetchCustomProperties().pipe(
            switchMap((prop) => {

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

                return this.taskApiService.createTask({
                    task: newTask,
                    schemaEvents: [this.taskFactoryService.createSchemaEvent(14)]
                });
            })
        );
    }
}
