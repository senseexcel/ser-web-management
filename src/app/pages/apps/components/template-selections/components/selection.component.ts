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

        this.registerTypeChangedEvent();
        this.registerObjectTypeChangedEvent();
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
        const formGroup: FormGroup = this.formBuilder.group({
            type: this.formBuilder.control(this.templateSelection.type || SelectionType.Dynamic),
            objectType: this.formBuilder.control(this.templateSelection.objectType || SelectionObjectType.DEFAULT)
        });
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

    private registerTypeChangedEvent() {

        this.selectionForm.controls.type.valueChanges.subscribe((value) => {
            this.templateSelection.type = value;
            if (value === SelectionType.Dynamic) {
                this.selectionForm.controls.objectType.setValue(SelectionObjectType.DEFAULT);
                this.selectionForm.controls.objectType.disable({ onlySelf: true, emitEvent: false });
            } else {
                this.selectionForm.controls.objectType.enable({ onlySelf: true, emitEvent: false });
            }
        });
    }

    private registerObjectTypeChangedEvent() {

        this.selectionForm.controls.objectType.valueChanges.subscribe((value) => {
            this.templateSelection.objectType = value;
            this.selectionType = this.templateSelection.objectType;

            /** clear values after selection has been changed */
            /** @todo cache old values so we can switch back */
            this.templateSelection.name = '';
            this.templateSelection.values = [];
        });
    }
}
