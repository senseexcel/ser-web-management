import { Component, OnInit } from '@angular/core';
import { FormService } from '@core/modules/form-helper';
import { TaskFormModel } from '@core/modules/ser-task/model/task-form.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-task-form-trigger',
    templateUrl: 'trigger.component.html'
})

export class FormTriggerComponent implements OnInit {

    /**
     * form group for trigger
     *
     * @type {FormGroup}
     * @memberof FormTriggerComponent
     */
    public triggerForm: FormGroup;

    /**
     * form builder service
     *
     * @private
     * @type {FormBuilder}
     * @memberof FormTriggerComponent
     */
    private formBuilder: FormBuilder;

    /**
     * Taskform Model
     *
     * @private
     * @type {TaskFormModel}
     * @memberof FormTriggerComponent
     */
    private formModel: TaskFormModel;

    /**
     * form helper service
     *
     * @private
     * @type {FormService<TaskFormModel, any>}
     * @memberof FormTriggerComponent
     */
    private formService: FormService<TaskFormModel, any>;

    /**
     *Creates an instance of FormTriggerComponent.
     * @param {FormBuilder} formBuilder
     * @param {FormService<TaskFormModel, any>} formService
     * @memberof FormTriggerComponent
     */
    constructor(
        formBuilder: FormBuilder,
        formService: FormService<TaskFormModel, any>
    ) {
        this.formBuilder = formBuilder;
        this.formService = formService;
    }

    /**
     * component gets initialized
     *
     * @memberof FormTriggerComponent
     */
    ngOnInit() {

        const updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, updateHook);

        this.formService.editModel().subscribe((model: TaskFormModel) => {
            if (!model) {
                return;
            }
            this.formModel   = model;
            this.triggerForm = this.createTriggerForm();
        });
    }

    /**
     * create trigger form group only hour
     *
     * @private
     * @returns {FormGroup}
     * @memberof FormTriggerComponent
     */
    private createTriggerForm(): FormGroup {
        return this.formBuilder.group({
            hour: this.formBuilder.control(null)
        });
    }

    /**
     * create hook for form should updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<any> {

        const observer = new Observable<any>((obs) => {

            /** update model data */
            const formData = this.triggerForm.getRawValue();
            this.formModel.task.trigger.hour = formData.hour;

            obs.next({
                valid: this.triggerForm.valid,
            });
        });

        return observer;
    }
}
