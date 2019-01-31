import { Component, OnInit } from '@angular/core';
import { ReportModel } from '@smc/modules/ser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectionObjectType, SelectionType } from '@smc/modules/ser';
import { FormService } from '@smc/modules/form-helper';
import { IDataNode } from '@smc/modules/smc-common';

@Component({
    selector: 'smc-edit-form-selections',
    templateUrl: 'selection.component.html'
})

export class SelectionComponent implements OnInit {

    /**
     * sense excel selection object types
     *
     * @type {SelectionObjectType}
     * @memberof SelectionComponent
     */
    public selectionObjectTypes: SelectionObjectType;

    /**
     * sense excel selection types static or dynamic
     *
     * @type {SelectionType}
     * @memberof SelectionComponent
     */
    public selectionTypes: SelectionType;

    /**
     * update hook which is called by formService on update form values
     * this should write current form data into model
     *
     * @private
     * @type {Observable<ISerFormResponse>}
     * @memberof SelectionComponent
     */
    private updateHook: Observable<boolean>;
    private report: ReportModel;

    /**
     * formgroup for template selections
     *
     * @private
     * @type {FormGroup}
     * @memberof SelectionComponent
     */
    private selectionForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, boolean>
    ) {
    }

    ngOnInit() {

        /** convert enums to json object */
        this.selectionTypes = this.convertEnumToJSON(SelectionType);
        this.selectionObjectTypes = this.convertEnumToJSON(SelectionObjectType);

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        /** register on app has been loaded and model has been loaded to edit*/
        this.formService.editModel()
            .subscribe((report: ReportModel) => {
                this.report = report;
                if (this.report) {
                    this.selectionForm = this.buildSelectionForm();
                }
            });
    }

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
                name: this.formBuilder.control(
                    selectionSettings.name
                ),
                objectType: this.formBuilder.control(selectionSettings.objectType || SelectionObjectType.DEFAULT),
                values: this.formBuilder.control(
                    selectionSettings.values ? selectionSettings.values.join(' ,') : ''
                )
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
     * dynamic form group
     *
     * @private
     * @memberof SelectionComponent
     */
    private buildDynamicSelectionFormGroup(): FormGroup {
        return this.buildSelectionForm();
    }

    /**
     * static form group
     */
    private buildStaticSelectionFormGroup(): FormGroup {
        return this.buildSelectionForm();
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
            const {name, values, objectType} = formData.selection;
            this.report.template.selections = [{
                name,
                values: values.split(',').map(val => val.replace(/(^\s*|\s*$)/g, '')),
                objectType, type: formData.type
            }];
            obs.next(true);
        });
        return observer;
    }
}
