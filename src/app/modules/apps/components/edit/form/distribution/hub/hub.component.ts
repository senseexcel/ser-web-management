import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DistributeMode } from 'ser.api';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Observable } from 'rxjs';
import { IFormResponse } from '@core/modules/form-helper';

@Component({
    selector: 'app-distribution-hub',
    templateUrl: 'hub.component.html'
})
export class DistributionHubComponent implements OnInit, OnDestroy {

    public hubForm: FormGroup;
    public distributeModes: any;

    private formService: FormService<ISerApp>;
    private app: ISerApp;
    private formBuilder: FormBuilder;
    private updateHook: Observable<IFormResponse>;

    constructor(
        formBuilder: FormBuilder,
        formService: FormService<ISerApp>
    ) {
        this.formBuilder = formBuilder;
        this.formService = formService;
    }

    ngOnDestroy() {
        this.formService.unRegisterHook(FormService.HOOK_UPDATE, this.updateHook);
    }

    ngOnInit() {

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        this.formService.loadApp()
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

    /**
     * create hook for form should updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<IFormResponse> {

        const observer = new Observable<IFormResponse>((obs) => {
            this.app.report.distribute.hub = this.hubForm.getRawValue();
            obs.next({
                errors: [],
                valid: this.hubForm.valid,
            });
        });
        return observer;
    }
}
