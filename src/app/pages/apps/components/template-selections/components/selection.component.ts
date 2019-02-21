import { Component, OnInit, Input, Inject, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ISerSenseSelection } from 'ser.api';
import { SelectionType, SelectionObjectType } from '@smc/modules/ser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
    selector: 'smc-template--selection',
    templateUrl: 'selection.component.html',
    styleUrls: ['selection.component.scss'],
})
export class TemplateSelectionComponent implements OnInit, OnDestroy {

    public selectionForm: FormGroup;
    public selectionTypes: SelectionType;
    public selectionObjectTypes: SelectionObjectType;
    public selectedDimension: { title: any; }[];
    public selectedValues: any;
    public selectionType = 'field';

    private templateSelection: ISerSenseSelection;
    private destroyed$: Subject<boolean> = new Subject();

    @Input()
    public set selection(selection: ISerSenseSelection) {
        this.templateSelection = selection;
    }

    @Output()
    public delete: EventEmitter<ISerSenseSelection> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
    ) { }

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
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
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

            this.templateSelection.type = value;

            const selectionFormGroup = formGroup.controls.selection as FormGroup;
            if (value === SelectionType.Dynamic) {
                selectionFormGroup.controls.objectType.setValue(SelectionObjectType.DEFAULT);
                selectionFormGroup.controls.objectType.disable({ onlySelf: true, emitEvent: false });
            } else {
                selectionFormGroup.controls.objectType.enable({ onlySelf: true, emitEvent: false });
            }
        });

        formGroup.controls.selection.valueChanges.subscribe((value) => {
            this.templateSelection.objectType = value.objectType;
            this.selectionType = this.templateSelection.objectType;
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
