import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionMode } from 'ser.api';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Observable } from 'rxjs';
import { IFormResponse } from '@core/modules/form-helper';

@Component({
    selector: 'app-edit-form-settings',
    templateUrl: 'settings.component.html'
})

export class SettingsComponent implements OnInit {

    private formBuilder: FormBuilder;

    public userSelectionMode: Array<{label: string, value: number}>;

    public generalForm: FormGroup;

    public mailServerSettingsForm: FormGroup;

    public formService: FormService<ISerApp>;

    private app: ISerApp;

    constructor(
        builder: FormBuilder,
        formService: FormService<ISerApp>,
    ) {
        this.formBuilder = builder;
        this.formService = formService;
    }

    ngOnInit() {

        this.formService.registerHook(FormService.HOOK_UPDATE, this.buildUpdateHook());
        this.formService.loadApp()
        .subscribe( (app: ISerApp) => {
            if ( app !== null ) {
                this.app = app;
                this.userSelectionMode      = this.buildUserSelectionFields();
                this.generalForm            = this.buildGeneralSettingsForm();
                this.mailServerSettingsForm = this.buildMailServerSettingsForm();
            }
        });
    }

    private buildGeneralSettingsForm(): FormGroup {
        const config       = this.app.report.general;
        const generalGroup = this.formBuilder.group({
            cleanUpTimer    : this.formBuilder.control(config.cleanupTimeOut),
            timeout         : this.formBuilder.control(config.timeout),
            errorRepeatCount: this.formBuilder.control(config.errorRepeatCount),
            useSandbox      : this.formBuilder.control(config.useSandbox),
            taskCount       : this.formBuilder.control(config.taskCount),
            useUserSelection: this.formBuilder.control(config.useUserSelections)
        });

        return generalGroup;
    }

    private buildMailServerSettingsForm(): FormGroup {
        // @TODO implement
        const mailServerSettings = this.app.report.distribute.mail.mailServer;
        return this.formBuilder.group({
            host: this.formBuilder.control(mailServerSettings.host),
            from: this.formBuilder.control(mailServerSettings.from),
            port: this.formBuilder.control(mailServerSettings.port),
            username: this.formBuilder.control(mailServerSettings.username),
            password: this.formBuilder.control(mailServerSettings.password),
            useSsl: this.formBuilder.control(mailServerSettings.useSsl)
        });
    }

    private buildUserSelectionFields(): Array<{label: string, value: number}> {
        return Object.keys(SelectionMode)
            .filter( (value) => {
                return isNaN( Number(value) );
            })
            .map( (name) => {
                return {
                    label: name,
                    value: SelectionMode[name]
                };
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
            obs.next({
                errors: [],
                valid: true,
            });
        });

        return observer;
    }
}
