import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-distribution-mail',
    templateUrl: 'mail.component.html'
})
export class DistributionMailComponent implements OnInit {

    public mailForm: FormGroup;

    private formBuilder: FormBuilder;


    constructor(
        formBuilder: FormBuilder,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.mailForm = this.formBuilder.group({
            mailServer: this.createMailServerGroup(),
            mail: this.createMailGroup()
        });
    }

    private createMailGroup(): FormGroup {

        /*
        const mailConfig = this.appProvider.resolveDistributionConfig();
        const mailData   = mailConfig.mail;

        return this.formBuilder.group({
            to: this.formBuilder.control(mailData.to,   [Validators.required, Validators.email]),
            cc: this.formBuilder.control(mailData.cc,   [Validators.email]),
            bcc: this.formBuilder.control(mailData.bcc, [Validators.email]),
            subject: this.formBuilder.control(mailData.subject, [Validators.required]),
            message: this.formBuilder.control(mailData.message, [Validators.required])
        });
        */
       return null;
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
