import { Component, OnInit, Input, Inject, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ISerSenseSelection } from 'ser.api';
import { SelectionType, SelectionObjectType } from '@smc/modules/ser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { AppConnector } from '@smc/modules/smc-common/provider/connection';
import { DIMENSION_SOURCE, VALUE_SOURCE } from '../provider/tokens';
import { SelectionPropertyConnector } from '../provider/selection-property.connector';
import { SelectionValueConnector } from '../provider/selection-value.connector';
import { switchMap, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { ISelection } from '../api/selections.interface';

@Component({
    selector: 'smc-template--selection',
    templateUrl: 'selection.component.html',
    styleUrls: ['selection.component.scss'],
    providers: [
        { provide: DIMENSION_SOURCE, useClass: SelectionPropertyConnector },
        { provide: VALUE_SOURCE, useClass: SelectionValueConnector }
    ]
})
export class TemplateSelectionComponent implements OnInit, OnDestroy {

    public selectionForm: FormGroup;
    public selectionTypes: SelectionType;
    public selectionObjectTypes: SelectionObjectType;

    private templateSelection: ISerSenseSelection;
    selectedDimension: { title: any; }[];
    selectedValues: any;
    selectionName: string;
    valueNames: string[];

    private destroyed$: Subject<boolean> = new Subject();

    @Input()
    public set selection(selection: ISerSenseSelection) {
        this.templateSelection = selection;
    }

    @Output()
    public delete: EventEmitter<ISerSenseSelection> = new EventEmitter();

    constructor(
        private connector: AppConnector,
        @Inject(DIMENSION_SOURCE) private dimensionSource: SelectionPropertyConnector,
        @Inject(VALUE_SOURCE) private valueSource: SelectionValueConnector,
        private formBuilder: FormBuilder,
    ) {
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

        this.selectionForm = this.buildSelectionForm();

        const selection = this.templateSelection || { values: [], name: '' };

        this.selectionName = selection.name;
        this.valueNames = selection.values;

        this.selectedDimension = selection.name && selection.name.length ? [{ title: selection.name }] : [];
        this.selectedValues = this.valueNames.map<ItemList.Item>((title) => {
            return { title };
        });

        this.registerAppConnector();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);

        this.valueSource.close();
        this.dimensionSource.close();
    }

    /**
     * completly deletes a selection
     * this will cause ngOnDestroy is triggered
     *
     * @memberof TemplateSelectionComponent
     */
    public deleteSelection() {
        this.delete.emit(this.templateSelection);
    }

    public dimensionChanged(event: ItemList.ChangedEvent) {
        if (event.added.length) {
            this.updateValueConnector(event.added[0] as ISelection.Item);
            return;
        }
        // could only be removed now so disable connector
        this.valueSource.disable(true);
    }

    public valueChanged(event: ItemList.ChangedEvent) {
        throw new Error('@todo implement');
    }

    /**
     * register app connector
     *
     * @private
     * @memberof TemplateSelectionComponent
     */
    private registerAppConnector() {
        this.connector.connect
            .pipe(
                switchMap((app: EngineAPI.IApp) => {
                    this.dimensionSource.config = { app };
                    this.valueSource.config = { app };
                    const needle = this.selectedDimension.length ? this.selectedDimension[0].title : null;
                    return forkJoin([
                        this.dimensionSource.findDimensionByName(needle),
                        this.dimensionSource.findFieldByName(needle)
                    ]);
                }),
                takeUntil(this.destroyed$)
            ).subscribe(([dimension, field]) => {
                this.updateValueConnector(dimension || field || { type: ISelection.TYPE.NONE, title: null });
            });

        this.connector.disconnect
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.valueSource.close();
                this.dimensionSource.close();
            });
    }

    /**
     * update value connector
     *
     * @private
     * @param {ISelection.Item} item
     * @memberof SelectionComponent
     */
    private updateValueConnector(item: ISelection.Item) {
        this.valueSource.disable(false);
        switch (item.type) {
            case ISelection.TYPE.DIMENSION:
                this.valueSource.config = {
                    selectFrom: {
                        type: ISelection.TYPE.DIMENSION,
                        value: item.id
                    }
                };
                break;
            case ISelection.TYPE.FIELD:
                this.valueSource.config = {
                    selectFrom: {
                        type: ISelection.TYPE.FIELD,
                        value: item.title
                    }
                };
                break;
            default:
                this.valueSource.disable(true);
        }
    }

    /**
     * build form for templates
     *
     * @private
     * @returns {FormGroup}
     * @memberof ConnectionComponent
     */
    private buildSelectionForm(): FormGroup {

        // const selectionSettings: IDataNode = this.report.template.selections[0] || {};
        const selectionType = this.templateSelection.type || SelectionType.Dynamic;

        const formGroup: FormGroup = this.formBuilder.group({
            type: this.formBuilder.control(null),
            selection: this.formBuilder.group({
                objectType: this.formBuilder.control(this.templateSelection.objectType || SelectionObjectType.DEFAULT)
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
}
