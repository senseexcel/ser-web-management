import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '@smc/modules/form-helper';
import { TaskFormModel } from '../../../model';
import { Observable } from 'rxjs';
import { IApp } from '@smc/modules/qrs';

@Component({
    selector: 'smc-task-form-identification',
    templateUrl: 'identification.component.html'
})

export class FormIdentificationComponent implements OnInit {

    /**
     * all task can only applied to an sense excel reporting app
     *
     * @type {IQrsApp[]}
     * @memberof FormIdentificationComponent
     */
    public apps: IApp[];

    public identificationForm: FormGroup;

    private formBuilder: FormBuilder;

    private formModel: TaskFormModel;

    /**
     * form helper sevice to get current model which should edited
     * add hooks on save.
     *
     * @private
     * @type {FormService<TaskModel, any>}
     * @memberof FormExcecutionComponent
     */
    private formService: FormService<TaskFormModel, any>;

    constructor(
        formBuilder: FormBuilder,
        formService: FormService<TaskFormModel, any>
    ) {
        this.formBuilder = formBuilder;
        this.formService = formService;
    }

    ngOnInit() {

        /** create / register update hook if form should be updated */
        const updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, updateHook);

        this.formService.editModel().subscribe((model: TaskFormModel) => {

            if (!model) {
                return;
            }

            this.formModel = model;
            this.apps      = model.apps;

            this.identificationForm = this.createIdentificationForm();
        });
    }

    /**
     * create form group for apps
     *
     * @private
     * @memberof TaskFormAppComponent
     */
    private createIdentificationForm(): FormGroup {

        const identification = this.formModel.task.identification;
        const app            = this.formModel.task.identification.app as any;

        return this.formBuilder.group({
            app : this.formBuilder.control(app ? app : null, Validators.required),
            name: this.formBuilder.control(identification.name, Validators.required)
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
            const formData = this.identificationForm.getRawValue();

            /** find selected app */
            const selectedApp = this.formModel.apps.find((app: IApp) => {
                return app.id === formData.app;
            });

            /** write data to model */
            this.formModel.task.app = selectedApp;
            this.formModel.task.identification.app = formData.app;
            this.formModel.task.identification.identificationName = formData.name;

            obs.next({
                valid: this.identificationForm.valid,
            });
        });

        return observer;
    }
}
