import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';

@Component({
    selector: 'app-task-new',
    templateUrl: 'new.component.html'
})

export class NewComponent implements OnInit {

    /**
     * control field to insert task name
     *
     * @type {FormControl}
     * @memberof NewComponent
     */
    public nameControl: FormControl;

    /**
     * form builder service to create name control field
     *
     * @private
     * @type {FormBuilder}
     * @memberof NewComponent
     */
    private formBuilder: FormBuilder;

    /**
     * app manager to get current selected app or all apps
     *
     * @private
     * @type {SerAppManagerService}
     * @memberof NewComponent
     */
    private appManager: SerAppManagerService;

    /**
     * task manager service
     *
     * @private
     * @type {TaskManagerService}
     * @memberof NewComponent
     */
    private taskManager: TaskManagerService;

    /**
     *Creates an instance of NewComponent.
     * @param {SerAppManagerService} appManager
     * @param {FormBuilder} formBuilder
     * @param {TaskManagerService} taskManager
     * @memberof NewComponent
     */
    constructor(
        appManager: SerAppManagerService,
        formBuilder: FormBuilder,
        taskManager: TaskManagerService
    ) {
        this.appManager = appManager;
        this.formBuilder = formBuilder;
        this.taskManager = taskManager;
    }

    ngOnInit() {
        this.nameControl = this.formBuilder.control(null, Validators.required);
    }

    /**
     * create new task and redirect to edit
     *
     * @memberof NewComponent
     */
    public onApply() {

        if ( this.nameControl.valid ) {
            // create new task now
            this.taskFactoryService.createTaskTemplate(name, appId);
            this.taskManager.createTask(this.nameControl.value);
        }
    }

    /**
     * cancel new component go one step back in breadcrumb
     *
     * @memberof NewComponent
     */
    public onCancel() {
    }
}
