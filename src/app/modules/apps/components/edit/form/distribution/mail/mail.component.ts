import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Observable } from 'rxjs';
import { IFormResponse } from '@core/modules/form-helper';

@Component({
    selector: 'app-distribution-mail',
    templateUrl: 'mail.component.html'
})
export class DistributionMailComponent implements OnInit {

    public mailForm: FormGroup;
    public formService: FormService<ISerApp>;

    private app: ISerApp;
    private formBuilder: FormBuilder;
    private updateHook: Observable<IFormResponse>;

    constructor(
        formBuilder: FormBuilder,
        formService: FormService<ISerApp>
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

    private createMailForm(): FormGroup {

        const mailSettings = this.app.report.distribute.mail;

        return this.formBuilder.group({
            to: this.formBuilder.control(mailSettings.to,   [Validators.required, Validators.email]),
            cc: this.formBuilder.control(mailSettings.cc,   [Validators.email]),
            bcc: this.formBuilder.control(mailSettings.bcc, [Validators.email]),
            subject: this.formBuilder.control(mailSettings.subject, [Validators.required]),
            message: this.formBuilder.control(mailSettings.message, [Validators.required])
        });
    }

    /**
     * create hook for form should updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<IFormResponse> {

        const observer = new Observable<IFormResponse>((obs) => {

            // save mailServer fist before we update so nothing is lost
            const mailServer = this.app.report.distribute.mail.mailServer;
            const mail = this.mailForm.getRawValue();
            mail.mailServer = mailServer;

            this.app.report.distribute.mail = mail;

            obs.next({
                errors: [],
                valid: this.mailForm.valid,
            });
        });
        return observer;
    }
}
