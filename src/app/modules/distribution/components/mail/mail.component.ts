import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-distribution-mail',
    templateUrl: 'mail.component.html'
})
export class DistributionMailComponent implements OnInit {

    public mailForm: FormGroup;

    private generalGroup: FormGroup;

    private mailFormGroup: FormGroup;

    private formBuilder: FormBuilder;

    constructor( formBuilder: FormBuilder ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.generalGroup  = this.createGeneralFormGroup();
        this.mailFormGroup = this.createMailFormGroup();

        this.mailForm = this.formBuilder.group({
            general: this.generalGroup,
            mail: this.mailFormGroup
        });
    }

    private createGeneralFormGroup(): FormGroup {

        const host   = this.formBuilder.control('', Validators.required);
        const from   = this.formBuilder.control('', [Validators.required, Validators.email]);
        const port   = this.formBuilder.control('', [Validators.required]);
        const uname  = this.formBuilder.control('', [Validators.required]);
        const passwd = this.formBuilder.control('', [Validators.required]);

        return this.formBuilder.group({
            host, from, port, uname, passwd });
    }

    private createMailFormGroup(): FormGroup {

        const recipient = this.formBuilder.control('', [Validators.required]);
        const subject   = this.formBuilder.control('', [Validators.required]);
        const message   = this.formBuilder.control('', [Validators.required]);

        return this.formBuilder.group({ recipient, subject, message});
    }
}
