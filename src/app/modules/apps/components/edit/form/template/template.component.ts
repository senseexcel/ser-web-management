import { Component, OnInit, Input } from '@angular/core';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '@core/modules/form-helper';
import { ISerFormResponse } from '@apps/api/ser-form.response.interface';
import { Observable } from 'rxjs';
import { ISerTemplate } from 'ser.api';

@Component({
    selector: 'app-edit-form-template',
    templateUrl: 'template.component.html',
    styleUrls: ['./template.component.scss']
})

export class TemplateComponent implements OnInit {

    public templateForm: FormGroup;

    private formBuilder: FormBuilder;
    private formService: FormService<ISerApp, ISerFormResponse>;
    private updateHook: Observable<ISerFormResponse>;
    private currentApp: ISerApp;

    constructor(
        formBuilder: FormBuilder,
        formService: FormService<ISerApp, ISerFormResponse>
    ) {
        this.formBuilder = formBuilder;
        this.formService = formService;
    }

    ngOnInit() {

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        /** register on app has been loaded */
        this.formService.loadApp()
        .subscribe ((app: ISerApp) => {
            this.currentApp = app;

            if ( this.currentApp ) {
                /** @todo should only update form fields and not create every time a new form group */
                this.templateForm = this.buildTemplateForm();
            }
        });
    }

    public setOutput(fileType: string) {
        const name = `${this.currentApp.title}.${fileType}`;
        this.templateForm.controls.output.setValue(name);
    }

    /**
     * build form for templates
     *
     * @private
     * @returns {FormGroup}
     * @memberof ConnectionComponent
     */
    private buildTemplateForm(): FormGroup {

        const formData: ISerTemplate = this.currentApp.report.template;

        const formGroup = this.formBuilder.group({
            input: this.formBuilder.control(formData.input, Validators.required),
            output: this.formBuilder.control(formData.output, Validators.required),
            outputFormat: this.formBuilder.control(formData.outputFormat),
            outputPassword: this.formBuilder.control(formData.outputPassword),
            scriptKeys: this.formBuilder.control(formData.scriptKeys),
            scriptArgs: this.formBuilder.control(formData.scriptArgs),
            generated: this.formBuilder.control(formData.generated)
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
