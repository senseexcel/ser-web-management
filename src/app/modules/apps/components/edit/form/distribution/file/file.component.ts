import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DistributeMode } from 'ser.api';

@Component({
    selector: 'app-distribution-file',
    templateUrl: 'file.component.html'
})

export class DistributionFileComponent implements OnInit {

    public fileForm: FormGroup;

    public distributionModes;

    private formBuilder: FormBuilder;

    constructor(
        formBuilder: FormBuilder
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.fileForm = this.createTemplateForm();
    }

    private createTemplateForm(): FormGroup {

        this.distributionModes = this.createDistributionModes();

        /*
        return this.formBuilder.group({
            active     : this.formBuilder.control(fileData.active),
            target     : this.formBuilder.control(fileData.target),
            mode       : this.formBuilder.control(fileData.mode),
            connections: this.formBuilder.control(fileData.connections)
        });
        */
       return null;
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
