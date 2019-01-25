import { Component, OnInit, Input } from '@angular/core';
import { IApp, ReportModel } from '@smc/modules/ser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '@smc/modules/form-helper';
import { ISerFormResponse } from '../../../../api/ser-form.response.interface';
import { Observable } from 'rxjs';
import { ISerTemplate } from 'ser.api';

@Component({
    selector: 'smc-edit-form-template',
    templateUrl: 'template.component.html',
    styleUrls: ['./template.component.scss']
})

export class TemplateComponent implements OnInit {

    public templateForm: FormGroup;
    private updateHook: Observable<ISerFormResponse>;
    private report: ReportModel;

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, ISerFormResponse>
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        /** register on app has been loaded */
        this.formService.editModel()
        .subscribe ((report: ReportModel) => {
            this.report = report;

            if (this.report) {
                /** @todo should only update form fields and not create every time a new form group */
                this.templateForm = this.buildTemplateForm();
            }
        });
    }

    public setOutput(event) {
        this.templateForm.controls.outputFormat.setValue(event.value);
    }

    /**
     * build form for templates
     *
     * @private
     * @returns {FormGroup}
     * @memberof ConnectionComponent
     */
    private buildTemplateForm(): FormGroup {

        const formData: ISerTemplate = this.report.template;

        const formGroup = this.formBuilder.group({
            input: this.formBuilder.control(formData.input, Validators.required),
            output: this.formBuilder.control(formData.output, Validators.required),
            outputFormat: this.formBuilder.control(formData.outputFormat),
            outputPassword: this.formBuilder.control(formData.outputPassword),
            scriptKeys: this.formBuilder.control(formData.scriptKeys),
            scriptArgs: this.formBuilder.control(formData.scriptArgs)
        });

        return formGroup;
    }

    /**
     * create hook for form should updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<ISerFormResponse> {

        const observer = new Observable<ISerFormResponse>((obs) => {
            obs.next({
                data: [{
                    fields: this.templateForm.getRawValue(),
                    group: 'template',
                    path: ''
                }],
                errors: [],
                valid: this.templateForm.valid,
            });
        });

        return observer;
    }
}
