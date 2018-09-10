import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Observable } from 'rxjs';
import { IFormResponse } from '@core/modules/form-helper';
import { ISerFormResponse } from '../../../../../api/ser-form.response.interface';

@Component({
    selector: 'app-distribution-mail',
    templateUrl: 'mail.component.html'
})
export class DistributionMailComponent implements OnInit {

    public mailForm: FormGroup;
    public formService: FormService<ISerApp, ISerFormResponse>;

    private app: ISerApp;
    private formBuilder: FormBuilder;
    private updateHook: Observable<IFormResponse>;

    public mailTypes = [{
        label: 'Markdown',
        value: 'markdown'
    }, {
        label: 'Html',
        value: 'html'
    }, {
        label: 'Text',
        value: 'text'
    }];

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

        this.formService.loadApp()
        .subscribe((app: ISerApp) => {

            if ( app === null ) {
                return;
            }

            this.app = app;
            this.mailForm = this.createMailForm();
        });
    }

    /**
     * create mail form
     *
     * @private
     * @returns {FormGroup}
     * @memberof DistributionMailComponent
     */
    private createMailForm(): FormGroup {
        const mailSettings = this.app.report.distribute.mail;
        return this.formBuilder.group({
            active: this.formBuilder.control(mailSettings.active),
            mailType: this.formBuilder.control(mailSettings.mailType),
            to: this.formBuilder.control(mailSettings.to,   [Validators.required, Validators.email]),
            cc: this.formBuilder.control(mailSettings.cc,   [Validators.email]),
            bcc: this.formBuilder.control(mailSettings.bcc, [Validators.email]),
            subject: this.formBuilder.control(mailSettings.subject, [Validators.required]),
            message: this.formBuilder.control(mailSettings.message, [Validators.required])
        });
    }

    /**
     * build hook before the form should be updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<ISerFormResponse> {

        const observer = new Observable<ISerFormResponse>((obs) => {
            const mail = this.mailForm.getRawValue();
            obs.next({
                data: [{
                    fields: mail,
                    group: 'mail',
                    path: 'distribute'
                }],
                errors: [],
                valid: this.mailForm.valid,
            });
        });
        return observer;
    }
}
