import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ISerApp } from '@core/ser-app/api/ser-app.interface';
import { EditAppService } from '@apps/provider/edit-app.service';

@Component({
    selector: 'app-distribution-mail',
    templateUrl: 'mail.component.html'
})
export class DistributionMailComponent implements OnInit {

    public mailForm: FormGroup;

    private formBuilder: FormBuilder;

    public editService: EditAppService;

    private app: ISerApp;

    constructor(
        formBuilder: FormBuilder,
        editService: EditAppService
    ) {
        this.formBuilder = formBuilder;
        this.editService = editService;
    }

    ngOnInit() {

        this.editService.loadApp()
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

    private createMailServerGroup(): FormGroup {
        /*
        const mailServer = this.appProvider.resolveDistributionConfig().mail.mailServer;

        return this.formBuilder.group({
            host: this.formBuilder.control(mailServer.host, [Validators.required]),
            from: this.formBuilder.control(mailServer.from, Validators.required),
            port: this.formBuilder.control(mailServer.port, Validators.required),
            username: this.formBuilder.control(mailServer.username, Validators.required),
            password: this.formBuilder.control(mailServer.password, [Validators.required]),
            useSsl: this.formBuilder.control(mailServer.useSsl || false)
        });
        */
       return null;
    }
}
