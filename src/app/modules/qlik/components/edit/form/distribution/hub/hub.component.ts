import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppProvider } from '@qlik/provider/app.provider';
import { DistributeMode } from 'ser.api';

@Component({
    selector: 'app-distribution-hub',
    templateUrl: 'hub.component.html'
})
export class DistributionHubComponent implements OnInit {

    public hubForm: FormGroup;

    public distributeModes: any;

    private formBuilder: FormBuilder;

    private appProvider: AppProvider;

    constructor(
        formBuilder: FormBuilder,
        appProvider: AppProvider,
    ) {
        this.formBuilder = formBuilder;
        this.appProvider = appProvider;
    }

    ngOnInit() {

        const hubConfig = this.appProvider.resolveDistributionConfig().hub;
        this.distributeModes = this.createDistributionModes();

        this.hubForm = this.formBuilder.group({
            active: this.formBuilder.control(hubConfig.active),
            owner: this.formBuilder.control(hubConfig.owner),
            mode: this.formBuilder.control(hubConfig.mode),
            connections: this.formBuilder.control(hubConfig.connections)
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
