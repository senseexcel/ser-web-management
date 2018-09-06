import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, SelectControlValueAccessor } from '@angular/forms';
import { SelectionMode, ISerGeneral } from 'ser.api';

@Component({
    selector: 'app-edit-form-settings',
    templateUrl: 'general.component.html'
})

export class GeneralComponent implements OnInit {

    private formBuilder: FormBuilder;

    public userSelectionMode: Array<{label: string, value: number}>;

    public generalForm: FormGroup;


    constructor(
        builder: FormBuilder,
    ) {
        this.formBuilder = builder;
    }

    ngOnInit() {
        this.userSelectionMode = this.buildUserSelectionFields();
        this.generalForm       = this.createGeneralForm();
    }

    private createGeneralForm(): FormGroup {
        /*
        const config       = this.appProvider.resolveGeneralConfig();
        const generalGroup = this.formBuilder.group({
            cleanUpTimer    : this.formBuilder.control(config.cleanupTimeOut),
            timeout         : this.formBuilder.control(config.timeout),
            errorRepeatCount: this.formBuilder.control(config.errorRepeatCount),
            useSandbox      : this.formBuilder.control(config.useSandbox),
            taskCount       : this.formBuilder.control(config.taskCount),
            useUserSelection: this.formBuilder.control(config.useUserSelections)
        });

        return generalGroup;
        */
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

    public applyConfig() {

        const config: ISerGeneral = {
            cleanupTimeOut   : this.generalForm.get('cleanUpTimer').value,
            errorRepeatCount : this.generalForm.get('errorRepeatCount').value,
            taskCount        : this.generalForm.get('taskCount').value,
            timeout          : this.generalForm.get('timeout').value,
            useSandbox       : this.generalForm.get('useSandbox').value,
            useUserSelections: this.generalForm.get('useUserSelection').value
        };
    }

    public reset() {
    }
}
