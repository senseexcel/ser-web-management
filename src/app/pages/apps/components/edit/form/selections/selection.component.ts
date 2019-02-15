import { Component, OnInit } from '@angular/core';
import { ReportModel } from '@smc/modules/ser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { SelectionObjectType, SelectionType } from '@smc/modules/ser';
import { FormService } from '@smc/modules/form-helper';
import { IDataNode } from '@smc/modules/smc-common';
import { AppConnector } from '@smc/pages/apps/providers/connection';
import { SelectionPropertyConnector } from '@smc/pages/apps/providers/selection-property.connector';
import { SelectionValueConnector } from '@smc/pages/apps/providers/selection-value.connector';
import { ItemList } from '@smc/modules/smc-ui/api/item-list.interface';
import { ISelection } from '@smc/pages/apps/api/selections.interface';
import { tap, switchMap } from 'rxjs/operators';

@Component({
    selector: 'smc-edit-form-selections',
    templateUrl: 'selection.component.html'
})
export class SelectionComponent implements OnInit {

    /**
     * name in report.template.selections mode,
     * will passed as items to item-list
     *
     * @type {ItemList.Item[]}
     * @memberof SelectionComponent
     */
    public selectedDimension: ItemList.Item[];

    /**
     * selected values, all values in report.template.selections model
     * passed as items to item-list
     *
     * @type {ItemList.Item[]}
     * @memberof SelectionComponent
     */
    public selectedValues: ItemList.Item[];

    public selectionObjectTypes: SelectionObjectType;
    public selectionTypes: SelectionType;
    public selectionForm: FormGroup;

    /**
     * connector to receive fields and dimensions from an app if we connected
     * passed to item-list as source connector
     *
     * @type {RemoteSource.Connector<IDataNode>}
     * @memberof SelectionComponent
     */
    public appDimensionConnector: SelectionPropertyConnector;

    /**
     * connector to receive values from connected app, depends on which value
     * has been selected from appDimensionConnector
     * will be disabled if no dimension or field is selected from auto complete
     * field.
     *
     * @type {SelectionValueConnector}
     * @memberof SelectionComponent
     */
    public appValueConnector: SelectionValueConnector;

    /**
     * update hook stream, will called if app save or preview is called
     *
     * @private
     * @type {Observable<boolean>}
     * @memberof SelectionComponent
     */
    private updateHook: Observable<boolean>;

    /**
     * loaded report model
     *
     * @private
     * @type {ReportModel}
     * @memberof SelectionComponent
     */
    private report: ReportModel;

    /**
     * selection name, will be set if we add a new value to item-list
     * for dimensions / fields
     *
     * @private
     * @memberof SelectionComponent
     */
    private selectionName = '';

    /**
     * value names which has been set, will update if value item-list
     * adds or remove new elements
     *
     * @private
     * @type {string[]}
     * @memberof SelectionComponent
     */
    private valueNames: string[] = [];

    /**
     * Creates an instance of SelectionComponent.
     * @param {AppConnector} appConnector
     * @param {FormBuilder} formBuilder
     * @param {FormService<ReportModel, boolean>} formService
     * @memberof SelectionComponent
     */
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

        const added: ISelection.Item[] = changedEvent.added as ISelection.Item[];
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
        this.appConnector.connection
            .pipe(
                tap((app: EngineAPI.IApp) => {
                    this.appDimensionConnector.config = { app };
                    this.appValueConnector.config = { app };
                }),
                switchMap(() => {
                    const needle = this.selectedDimension.length ? this.selectedDimension[0].title : null;
                    return forkJoin([
                        this.appDimensionConnector.findDimensionByName(needle),
                        this.appDimensionConnector.findFieldByName(needle)
                    ]);
                })
            ).subscribe(([dimension, field]) => {
                this.appValueConnector.disable(false);
                if (dimension) {
                    this.appValueConnector.config = {
                        selectFrom: {
                            type: ISelection.TYPE.DIMENSION,
                            value: dimension.id
                        }
                    };
                    return;
                }

                if (field) {
                    this.appValueConnector.config = {
                        selectFrom: {
                            type: ISelection.TYPE.FIELD,
                            value: field.title
                        }
                    };
                    return;
                }
                this.appValueConnector.disable(true);
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

                    this.selectedDimension = [{ title: this.report.template.selections[0].name }];
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
