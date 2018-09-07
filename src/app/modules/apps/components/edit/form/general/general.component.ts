import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { FormBuilder, FormGroup, SelectControlValueAccessor } from '@angular/forms';
import { SelectionMode, ISerGeneral } from 'ser.api';
import { ISerApp } from '@core/ser-app/api/ser-app.interface';
import { EditAppService } from '@apps/provider/edit-app.service';

@Component({
    selector: 'app-edit-form-settings',
    templateUrl: 'general.component.html'
})

export class GeneralComponent implements OnInit {

    private formBuilder: FormBuilder;

    public userSelectionMode: Array<{label: string, value: number}>;

    public generalForm: FormGroup;

    public editService: EditAppService;

    private app: ISerApp;

    constructor(
        builder: FormBuilder,
        editService: EditAppService,
    ) {
        this.formBuilder = builder;
        this.editService = editService;
    }

    ngOnInit() {

        this.editService.loadApp()
        .subscribe( (app: ISerApp) => {
            if ( app !== null ) {
                this.app = app;
                this.userSelectionMode = this.buildUserSelectionFields();
                this.generalForm       = this.createGeneralForm();
            }
        });
    }

    private createGeneralForm(): FormGroup {
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

    private generateMailServerSettingsForm(): FormGroup {
        // @TODO implement
        return null;
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
}
