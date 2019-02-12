import { Component, OnInit } from '@angular/core';
import { ReportModel } from '@smc/modules/ser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectionObjectType, SelectionType } from '@smc/modules/ser';
import { FormService } from '@smc/modules/form-helper';
import { IDataNode } from '@smc/modules/smc-common';
import { AppConnector } from '@smc/pages/apps/providers/connection';
import { SelectionPropertyConnector } from '@smc/pages/apps/providers/selection-property.connector';
import { SelectionValueConnector } from '@smc/pages/apps/providers/selection-value.connector';
import { EmptyRemoteSourceConnector } from '@smc/modules/smc-ui/provider';
import { RemoteSource } from '@smc/modules/smc-ui/api/remote-source.connector';

@Component({
    selector: 'smc-edit-form-selections',
    templateUrl: 'selection.component.html'
})

export class SelectionComponent implements OnInit {

    public selectionObjectTypes: SelectionObjectType;
    public selectedValues: string[];
    public selectionSource: string[];
    public selectionTypes: SelectionType;
    public selectionForm: FormGroup;

    public appDimensionConnector: RemoteSource.Connector;
    public appValueConnector: RemoteSource.Connector;

    private updateHook: Observable<boolean>;
    private report: ReportModel;

    constructor(
        private appConnector: AppConnector,
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, boolean>
    ) {
        this.selectionSource = [];
        this.selectedValues  = [];
    }

    /**
     * component gets initialized
     *
     * @memberof SelectionComponent
     */
    ngOnInit() {
        /** convert enums to json object */
        this.selectionTypes = this.convertEnumToJSON(SelectionType);
        this.selectionObjectTypes = this.convertEnumToJSON(SelectionObjectType);

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        this.registerFormService();
        this.registerAppConnector();
    }

    /**
     * if app has been connected
     *
     * @private
     * @memberof SelectionComponent
     */
    private registerAppConnector() {
        this.appConnector.connection.subscribe((app: EngineAPI.IApp) => {
            if (!app) {
                this.appDimensionConnector = new EmptyRemoteSourceConnector();
                this.appValueConnector = new EmptyRemoteSourceConnector();
                return;
            }
            this.appDimensionConnector = new SelectionPropertyConnector();
            this.appValueConnector = new SelectionValueConnector();

            this.appDimensionConnector.config = {app};
        });
    }

    /**
     *
     *
     * @private
     * @memberof SelectionComponent
     */
    private registerFormService() {
        /** register on app has been loaded and model has been loaded to edit*/
        this.formService.editModel()
            .subscribe((report: ReportModel) => {
                this.report = report;
                if (this.report) {
                    this.selectionForm = this.buildSelectionForm();
                    this.selectedValues = this.report.template.selections[0].values;
                }
            });
    }

    /**
     *
     *
     * @private
     * @param {*} data
     * @returns {*}
     * @memberof SelectionComponent
     */
    private convertEnumToJSON(data): any {
        return Object.keys(data)
            .filter((key) => {
                return isNaN(Number(key));
            })
            .map((key) => {
                return {
                    label: key,
                    value: data[key]
                };
            });
    }

    /**
     * build form for templates
     *
     * @private
     * @returns {FormGroup}
     * @memberof ConnectionComponent
     */
    private buildSelectionForm(): FormGroup {

        const selectionSettings: IDataNode = this.report.template.selections[0] || {};
        const selectionType = selectionSettings.type || SelectionType.Dynamic;

        const formGroup: FormGroup = this.formBuilder.group({
            type: this.formBuilder.control(null),
            selection: this.formBuilder.group({
                objectType: this.formBuilder.control(selectionSettings.objectType || SelectionObjectType.DEFAULT)
            })
        });

        formGroup.controls.type.valueChanges.subscribe((value) => {
            const selectionFormGroup = formGroup.controls.selection as FormGroup;
            if (value === SelectionType.Dynamic) {
                selectionFormGroup.controls.objectType.setValue(SelectionObjectType.DEFAULT);
                selectionFormGroup.controls.objectType.disable({ onlySelf: true, emitEvent: false });
            } else {
                selectionFormGroup.controls.objectType.enable({ onlySelf: true, emitEvent: false });
            }
        });

        // set type one time to trigger change event
        formGroup.controls.type.setValue(selectionType);
        return formGroup;
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

            if (this.selectionForm.invalid) {
                obs.next(false);
                return;
            }

            const formData: IDataNode = this.selectionForm.getRawValue();
            const { objectType } = formData.selection;
            this.report.template.selections = [{
                name,
                values: [],
                objectType, type: formData.type
            }];
            obs.next(true);
        });
        return observer;
    }
}
