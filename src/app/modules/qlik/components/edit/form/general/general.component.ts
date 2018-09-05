import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, SelectControlValueAccessor } from '@angular/forms';
import { SelectionMode, ISerGeneral } from 'ser.api';
import { AppProvider } from '@qlik/provider/app.provider';

@Component({
    selector: 'app-qapp-edit-general',
    templateUrl: 'general.component.html'
})

export class GeneralComponent implements OnInit {

    private formBuilder: FormBuilder;

    @HostBinding('class')
    protected hostClass = 'flex-container flex-column';

    public userSelectionMode: Array<{label: string, value: number}>;

    public generalForm: FormGroup;

    private appProvider: AppProvider;

    constructor(
        builder: FormBuilder,
        appProvider: AppProvider
    ) {
        this.formBuilder = builder;
        this.appProvider = appProvider;
    }

    ngOnInit() {
        this.userSelectionMode = this.buildUserSelectionFields();
        this.generalForm       = this.createGeneralForm();

        console.log(this.userSelectionMode);
    }

    private createGeneralForm(): FormGroup {
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

        this.appProvider.writeGeneralConfiguration(config);
    }

    public reset() {
    }
}
