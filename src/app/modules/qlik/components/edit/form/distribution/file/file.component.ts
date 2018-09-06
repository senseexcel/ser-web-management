import { Component, OnInit } from '@angular/core';
import { AppProvider } from '@qlik/provider/app.provider';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DistributeMode } from 'ser.api';

@Component({
    selector: 'app-distribution-file',
    templateUrl: 'file.component.html'
})

export class DistributionFileComponent implements OnInit {

    public fileForm: FormGroup;

    public distributionModes;

    private appProvider: AppProvider;

    private formBuilder: FormBuilder;

    constructor(
        appProvider: AppProvider,
        formBuilder: FormBuilder
    ) {
        this.appProvider = appProvider;
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.fileForm = this.createTemplateForm();
    }

    private createTemplateForm(): FormGroup {

        const fileData = this.appProvider.resolveDistributionConfig().file;
        this.distributionModes = this.createDistributionModes();

        return this.formBuilder.group({
            active     : this.formBuilder.control(fileData.active),
            target     : this.formBuilder.control(fileData.target),
            mode       : this.formBuilder.control(fileData.mode),
            connections: this.formBuilder.control(fileData.connections)
        });
    }

    private createDistributionModes(): Array<{label: string, value: string}> {

        return Object.keys(DistributeMode)
            .filter( (value) => {
                return isNaN( Number(value) );
            })
            .map( (name) => {
                return {
                    label: name,
                    value: name
                };
            });
    }
}
