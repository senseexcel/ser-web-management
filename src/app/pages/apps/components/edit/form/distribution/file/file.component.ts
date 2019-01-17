import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DistributeMode } from 'ser.api';
import { IApp } from '@smc/modules/ser/api/app.interface';
import { FormService } from '@smc/modules/form-helper';
import { Observable } from 'rxjs';
import { ISerFormResponse } from '../../../../../api/ser-form.response.interface';

@Component({
    selector: 'smc-apps--edit-form-distribution-file',
    templateUrl: 'file.component.html'
})

export class DistributionFileComponent implements OnInit, OnDestroy {

    public fileForm: FormGroup;
    public distributionModes;

    private app: IApp;
    private formBuilder: FormBuilder;
    private formService: FormService<IApp, ISerFormResponse>;
    private updateHook: Observable<ISerFormResponse>;

    constructor(
        formBuilder: FormBuilder,
        formService: FormService<IApp, ISerFormResponse>
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

        this.formService.editModel()
        .subscribe((app: IApp) => {

            if ( app === null ) {
                return;
            }

            this.app = app;
            this.fileForm = this.createFileForm();
        });
    }

    /**
     * create form components for distribute file
     *
     * @private
     * @returns {FormGroup}
     * @memberof DistributionFileComponent
     */
    private createFileForm(): FormGroup {

        this.distributionModes = this.createDistributionModes();
        const fileData = this.app.report.distribute.file;

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

    /**
     * create hook for form should updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<ISerFormResponse> {

        const observer = new Observable<ISerFormResponse>((obs) => {
            const fileData = this.fileForm.getRawValue();
            fileData.mode  = this.fileForm.controls.mode.value;

            obs.next({
                data: [{
                    fields: fileData,
                    group: 'file',
                    path: 'distribute'
                }],
                errors: [],
                valid: this.fileForm.valid,
            });
        });
        return observer;
    }
}
