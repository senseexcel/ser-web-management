import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DistributeMode } from 'ser.api';
import { EditAppService } from '@apps/provider/edit-app.service';
import { ISerApp } from '@core/ser-app/api/ser-app.interface';

@Component({
    selector: 'app-distribution-file',
    templateUrl: 'file.component.html'
})

export class DistributionFileComponent implements OnInit {

    public fileForm: FormGroup;

    public distributionModes;

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
            this.fileForm = this.createTemplateForm();
        });
    }

    private createTemplateForm(): FormGroup {

        this.distributionModes = this.createDistributionModes();
        const fileData = this.app.report.distribute.file;

        return this.formBuilder.group({
            active     : this.formBuilder.control(fileData.active),
            target     : this.formBuilder.control(fileData.target),
            mode       : this.formBuilder.control(fileData.mode),
            connections: this.formBuilder.control(fileData.connections)
        });
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
