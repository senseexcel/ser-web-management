import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DistributeMode } from 'ser.api';
import { FormService } from '@smc/modules/form-helper';
import { Observable } from 'rxjs';
import { ISerFormResponse } from '../../../../../api/ser-form.response.interface';
import { ReportModel } from '@smc/modules/ser';

@Component({
    selector: 'smc-apps--edit-form-distribution-hub',
    templateUrl: 'hub.component.html'
})
export class DistributionHubComponent implements OnInit, OnDestroy {

    public hubForm: FormGroup;
    public distributeModes: any;

    private report: ReportModel;
    private updateHook: Observable<ISerFormResponse>;

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, ISerFormResponse>
    ) {
    }

    ngOnDestroy() {
        this.formService.unRegisterHook(FormService.HOOK_UPDATE, this.updateHook);
    }

    ngOnInit() {

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        this.formService.editModel()
        .subscribe((report: ReportModel) => {
            this.report = report;
            this.distributeModes = this.createDistributionModes();

            const hubSettings = this.report.distribute.hub;

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
    private buildUpdateHook(): Observable<ISerFormResponse> {

        const observer = new Observable<ISerFormResponse>((obs) => {
            obs.next({
                data: [{
                    fields: this.hubForm.getRawValue(),
                    group: 'hub',
                    path: 'distribute'
                }],
                errors: [],
                valid: this.hubForm.valid,
            });
        });
        return observer;
    }
}
