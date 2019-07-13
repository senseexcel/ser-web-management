import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DistributeMode } from 'ser.api';
import { FormService } from '@smc/modules/form-helper';
import { Observable } from 'rxjs';
import { ReportModel } from '@smc/modules/ser';

@Component({
    selector: 'smc-apps--edit-form-distribution-file',
    templateUrl: 'file.component.html'
})

export class DistributionFileComponent implements OnInit, OnDestroy {

    public fileForm: FormGroup;
    public distributionModes;

    private report: ReportModel;
    private updateHook: Observable<boolean>;

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, boolean>
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
        const fileData = this.report.distribute.file;

        return this.formBuilder.group({
            active     : this.formBuilder.control(fileData.active),
            target     : this.formBuilder.control(fileData.target),
            mode       : this.formBuilder.control(fileData.mode),
            connections: this.formBuilder.control(fileData.connections)
        });
    }

    private createDistributionModes(): Array<{label: string, value: string}> {

        return Object.keys(DistributeMode)
            .filter((value) => isNaN(Number(value)))
            .map((name) => {
                return {
                    label: `SMC_APPS.EDIT.FORM.DISTRIBUTION.TAB.FILE.FIELD.${name.toUpperCase()}`,
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
    private buildUpdateHook(): Observable<boolean> {
        const observer = new Observable<boolean>((obs) => {
            const fileData = this.fileForm.getRawValue();
            fileData.mode  = this.fileForm.controls.mode.value;

            if (this.fileForm.invalid) {
                obs.next(false);
                return;
            }
            this.report.distribute.file.raw = this.fileForm.getRawValue();
            this.report.distribute.file.mode = this.fileForm.controls.mode.value;
            obs.next(true);
        });
        return observer;
    }
}
