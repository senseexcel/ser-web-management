import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportModel } from '@smc/modules/ser';
import { FormService, IFormResponse } from '@smc/modules/form-helper';
import { Observable } from 'rxjs';

@Component({
    selector: 'smc-apps--edit-form-distribution-mail',
    templateUrl: 'mail.component.html'
})
export class DistributionMailComponent implements OnInit {

    public mailForm: FormGroup;

    private report: ReportModel;
    private updateHook: Observable<boolean>;

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
        private formService: FormService<ReportModel, boolean>
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
            to: this.formBuilder.control(mailSettings.to),
            cc: this.formBuilder.control(mailSettings.cc),
            bcc: this.formBuilder.control(mailSettings.bcc),
            subject: this.formBuilder.control(mailSettings.subject),
            message: this.formBuilder.control(mailSettings.message)
        });
    }

    /**
     * build hook before the form should be updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<boolean> {
        const observer = new Observable<boolean>((obs) => {
            if (this.mailForm.invalid) {
                obs.next(false);
                return;
            }
            this.report.distribute.mail.raw = this.mailForm.getRawValue();
            obs.next(true);
        });
        return observer;
    }
}
