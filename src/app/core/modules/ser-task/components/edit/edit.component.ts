import { Component, OnInit } from '@angular/core';
import { FormService } from '@core/modules/form-helper';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';
import { filter, map, switchMap, catchError } from 'rxjs/operators';
import { TaskService } from '@core/modules/ser-task/services/task.service';
import { TaskModel } from '@core/modules/ser-task/model/task.model';
import { never, of, Observable } from 'rxjs';
import { TaskFactoryService } from '@core/modules/ser-task/services/task-factory.service';

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
     * form helper service
     *
     * @private
     * @type {FormService<ITask, any>}
     * @memberof EditComponent
     */
    private formHelperService: FormService<TaskModel, any>;

    /**
     * task service to create and update task models
     *
     * @private
     * @type {TaskService}
     * @memberof EditComponent
     */
    private taskService: TaskFactoryService;

    /**
     * taskmanager service to fetch tasks
     *
     * @private
     * @type {TaskManagerService}
     * @memberof EditComponent
     */
    private taskManagerService: TaskManagerService;

    /**
     *Creates an instance of EditComponent.
     * @param {FormService<ITask, any>} formHelperService
     * @param {ActivatedRoute} rote
     * @memberof EditComponent
     */
    constructor(
        formHelperService: FormService<TaskModel, any>,
        taskManagerService: TaskManagerService,
        taskFactoryService: TaskFactoryService,
    ) {
        this.formHelperService  = formHelperService;
        this.taskManagerService = taskManagerService;
        this.taskService        = taskFactoryService;
    }

    /**
     * component get initialized, check activated route to
     * get current action, new or edit
     *
     * @memberof EditComponent
     */
    ngOnInit() {

        this.taskManagerService.selectedTasks
            .pipe(
                filter((tasks: ITask[]) => {
                    return tasks.length > 0;
                })
            )
            .subscribe((tasks: ITask[]) => {
                this.tasks = tasks;
                this.editTask(tasks[0]);
            });
    }

    /**
     * apply form data and save to task model
     *
     * @memberof EditComponent
     */
    public onApply() {
        const taskData = this.tasks[0];
        this.formHelperService.updateModel()
            .pipe(
                switchMap((responseData: any[]) => {
                    responseData.forEach((response) => {
                        Object.keys(response.data.fields).forEach((field) => {
                            taskData[field] = response.data.fields[field];
                        });
                    });
                    return this.taskManagerService.updateTask(taskData.id, taskData);
                }),
                catchError((error, caught: Observable<ITask>) => {
                    console.log(error);
                    console.log(caught);
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
        const model: TaskModel = this.taskService.buildTask(task);
        this.formHelperService.loadModel(model);
    }

    /**
     * create new task
     *
     * @private
     * @param {*} taskName
     * @memberof EditComponent
     */
    private createNewtask(taskName) {
    }
}
