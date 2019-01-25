import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IApp, ReportModel } from '@smc/modules/ser';
import { FormService, IFormResponse } from '@smc/modules/form-helper';
import { Observable } from 'rxjs';
import { ISerFormResponse } from '../../../../../api/ser-form.response.interface';
import { IMailSettings } from 'ser.api';

@Component({
    selector: 'smc-apps--edit-form-distribution-mail',
    templateUrl: 'mail.component.html'
})
export class DistributionMailComponent implements OnInit {

    public mailForm: FormGroup;

    private report: ReportModel;
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
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, ISerFormResponse>
    ) {
    }

    ngOnInit() {

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        this.formService.editModel()
        .subscribe((report: ReportModel) => {
            this.report = report;
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
        const mailSettings = this.report.distribute.mail;
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
