import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DistributeMode } from 'ser.api';
import { EditAppService } from '@apps/provider/edit-app.service';
import { ISerApp } from '@core/ser-app/api/ser-app.interface';

@Component({
    selector: 'app-distribution-hub',
    templateUrl: 'hub.component.html'
})
export class DistributionHubComponent implements OnInit {

    public hubForm: FormGroup;

    public distributeModes: any;

    public editService: EditAppService;

    private app: ISerApp;

    private formBuilder: FormBuilder;

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
            this.distributeModes = this.createDistributionModes();

            const hubSettings = this.app.report.distribute.hub;

            this.hubForm = this.formBuilder.group({
                active: this.formBuilder.control(hubSettings.active),
                owner: this.formBuilder.control(hubSettings.owner),
                mode: this.formBuilder.control(hubSettings.mode),
                connections: this.formBuilder.control(hubSettings.connections)
            });
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
