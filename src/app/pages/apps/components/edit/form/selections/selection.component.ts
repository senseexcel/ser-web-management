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
import { RemoteSource, ItemList } from '@smc/modules/smc-ui/api/item-list.interface';
import { ISelection } from '@smc/pages/apps/api/selections.interface';

@Component({
    selector: 'smc-edit-form-selections',
    templateUrl: 'selection.component.html'
})

export class SelectionComponent implements OnInit {

    public selectedDimension: ItemList.Item[];
    public selectedValues: ItemList.Item[];

    public selectionObjectTypes: SelectionObjectType;
    public selectionTypes: SelectionType;
    public selectionForm: FormGroup;

    public appDimensionConnector: RemoteSource.Connector<IDataNode>;
    public appValueConnector: RemoteSource.Connector<ISelection.ValueConnectorConfig>;

    private updateHook: Observable<boolean>;
    private report: ReportModel;

    private selectionName = '';
    private valueNames: string[]     = [];

    constructor(
        private appConnector: AppConnector,
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, boolean>
    ) {
        this.selectedDimension = [];
        this.selectedValues = [];

        this.appDimensionConnector = new SelectionPropertyConnector();
        this.appValueConnector = new SelectionValueConnector();
    }

    /**
     * component gets initialized
     *
     * @memberof SelectionComponent
     */
    ngOnInit() {
        /** convert enums to json object */
        this.selectionTypes = this.convertEnumToJSON(SelectionType, 'SMC_APPS.EDIT.FORM.SELECTIONS.TYPE', 'LABEL');
        this.selectionObjectTypes = this.convertEnumToJSON(SelectionObjectType, 'SMC_APPS.EDIT.FORM.SELECTIONS.TYPE.STATIC.TYPE');

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        this.registerFormService();
        this.registerAppConnector();
    }

    /**
     * dimension / field has been changed
     *
     * @param {ItemList.ChangedEvent} changedEvent
     * @memberof SelectionComponent
     */
    public selectionNameChanged(changedEvent: ItemList.ChangedEvent) {

        const added: ISelection.Item[]   = changedEvent.added as ISelection.Item[];
        const valueConnectionConfig: ISelection.ValueConnectorConfig = {};

        this.appValueConnector.disable(false);

        if (added.length) {
            switch (added[0].type) {
                case ISelection.TYPE.DIMENSION:
                    valueConnectionConfig.selectFrom = {
                        type: ISelection.TYPE.DIMENSION,
                        value: added[0].id
                    };
                    break;
                case ISelection.TYPE.FIELD:
                    valueConnectionConfig.selectFrom = {
                        type: ISelection.TYPE.FIELD,
                        value: added[0].title
                    };
                    break;
                default:
                    this.appValueConnector.disable(true);
            }
        } else {
            this.appValueConnector.disable(true);
        }

        this.selectionName = changedEvent.items[0] ? changedEvent.items[0].title : '';
        this.appValueConnector.config = valueConnectionConfig;
    }

    /**
     * selection values has been changed
     *
     * @param {ItemList.ChangedEvent} changedEvent
     * @memberof SelectionComponent
     */
    public selectionValuesChanged(changedEvent: ItemList.ChangedEvent) {

        this.valueNames = changedEvent.items.reduce<string[]>((itemNames: string[], selectedItem: ItemList.Item) => {
            return [...itemNames, selectedItem.title];
        }, []);
    }

    /**
     * register to app connector to get notified we have
     * create a connection to an app.
     *
     * @private
     * @memberof SelectionComponent
     */
    private registerAppConnector() {
        this.appConnector.connection.subscribe((app: EngineAPI.IApp) => {

            if (app) {
                this.appDimensionConnector.config = { app };
                this.appValueConnector.config = { app };
            }
        });
    }

    /**
     * register to form service to get notified if a model has
     * been loaded
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
                    const selectionValues = this.report.template.selections[0].values;
                    this.selectionForm = this.buildSelectionForm();

                    this.selectedDimension = [{title: this.report.template.selections[0].name}];
                    this.selectedValues = selectionValues.map<ItemList.Item>((title) => {
                        return { title };
                    });
                }
            });
    }

    /**
     * convert enums to json
     *
     * @private
     * @param {*} _enum
     * @param {string} i18nPrefix
     * @param {string} [i18nPostfix]
     * @returns {*}
     * @memberof SelectionComponent
     */
    private convertEnumToJSON(_enum, i18nPrefix: string, i18nPostfix?: string): any {
        return Object.keys(_enum)
            .filter((key) => isNaN(Number(key)))
            .map((key) => {
                let label = `${i18nPrefix}.${key.toUpperCase()}`;
                label = i18nPostfix ? label.concat('.', i18nPostfix) : label;
                return {
                    label,
                    value: _enum[key]
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
                name: this.selectionName,
                values: this.valueNames,
                objectType, type: formData.type
            }];
            obs.next(true);
        });
        return observer;
    }
}
