import { Component, OnInit } from '@angular/core';
import { FormService } from '@core/modules/form-helper';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { ActivatedRoute } from '@angular/router';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { TaskService } from '@core/modules/ser-task/services/task.service';
import { TaskModel } from '@core/modules/ser-task/model/task.model';

@Component({
    selector: 'app-task-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
    providers: [FormService]
})

export class EditComponent implements OnInit {

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
    private taskService: TaskService;

    /**
     * taskmanager service to fetch tasks
     *
     * @private
     * @type {TaskManagerService}
     * @memberof EditComponent
     */
    private taskManagerService: TaskManagerService;

    /**
     * activated route
     *
     * @private
     * @type {ActivatedRoute}
     * @memberof EditComponent
     */
    private route: ActivatedRoute;

    /**
     *Creates an instance of EditComponent.
     * @param {FormService<ITask, any>} formHelperService
     * @param {ActivatedRoute} rote
     * @memberof EditComponent
     */
    constructor(
        formHelperService: FormService<TaskModel, any>,
        taskManagerService: TaskManagerService,
        taskService: TaskService,
        route: ActivatedRoute
    ) {
        this.route              = route;
        this.formHelperService  = formHelperService;
        this.taskManagerService = taskManagerService;
        this.taskService        = taskService;
    }

    /**
     * component get initialized, check activated route to
     * get current action, new or edit
     *
     * @memberof EditComponent
     */
    ngOnInit() {
        const params = this.route.snapshot.params;

        if ( params.hasOwnProperty('id') ) {
            this.editExistingTask(params.id);
        } else {
            this.createNewtask(params.name);
        }
    }

    /**
     * edit existing task
     *
     * @private
     * @memberof EditComponent
     */
    private editExistingTask(id) {

        this.taskManagerService.loadTasks()
            .pipe(
                switchMap((tasks: ITask[]) => {
                    return from(tasks);
                }),
                filter( (task: ITask) => {
                    return task.id === id;
                })
            )
            .subscribe((task: ITask) => {
                const model: TaskModel = this.taskService.buildTask(task);
                this.formHelperService.loadModel(model);
            });
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
