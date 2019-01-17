import { Component, OnInit } from '@angular/core';
import { IApp } from '@smc/modules/ser';
import { ISerFormResponse } from '../../../../api/ser-form.response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectionObjectType, SelectionModel, SelectionType } from '@smc/modules/ser';
import { FormService } from '@smc/modules/form-helper';

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
     * form builder service to create form elements
     *
     * @private
     * @type {FormBuilder}
     * @memberof SelectionComponent
     */
    private formBuilder: FormBuilder;

    /**
     * form helper service to get notified if a new model has been
     * loaded or form should save
     *
     * @private
     * @type {FormService<IApp, ISerFormResponse>}
     * @memberof SelectionComponent
     */
    private formService: FormService<IApp, ISerFormResponse>;

    /**
     * update hook which is called by formService on update form values
     * this should write current form data into model
     *
     * @private
     * @type {Observable<ISerFormResponse>}
     * @memberof SelectionComponent
     */
    private updateHook: Observable<ISerFormResponse>;

    /**
     * current app model which has been loaded
     *
     * @private
     * @type {IApp}
     * @memberof SelectionComponent
     */
    private currentApp: IApp;

    /**
     * formgroup for template selections
     *
     * @private
     * @type {FormGroup}
     * @memberof SelectionComponent
     */
    private selectionForm: FormGroup;

    constructor(
        formBuilder: FormBuilder,
        formService: FormService<IApp, ISerFormResponse>
    ) {
        this.formBuilder = formBuilder;
        this.formService = formService;
    }

    ngOnInit() {

        /** convert enums to json object */
        this.selectionTypes       = this.convertEnumToJSON(SelectionType);
        this.selectionObjectTypes = this.convertEnumToJSON(SelectionObjectType);

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        /** register on app has been loaded and model has been loaded to edit*/
        this.formService.editModel()
        .subscribe ((app: IApp) => {
            this.currentApp = app;
            if ( this.currentApp ) {
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

        const selectionSettings = this.currentApp.report.template.selections[0] || {};
        const selectionType     = selectionSettings.type || SelectionType.Dynamic;

        const formGroup: FormGroup = this.formBuilder.group({
            type: this.formBuilder.control(null),
            selection: this.formBuilder.group({
                name: this.formBuilder.control(
                    selectionSettings.name
                ),
                objectType: this.formBuilder.control(selectionSettings.objectType || SelectionObjectType.DEFAULT),
                values: this.formBuilder.control(
                    selectionSettings.values ? selectionSettings.values[0] : ''
                )
            })
        });

        formGroup.controls.type.valueChanges.subscribe((value) => {
            const selectionFormGroup = formGroup.controls.selection as FormGroup;
            if (value === SelectionType.Dynamic) {
                selectionFormGroup.controls.objectType.setValue(SelectionObjectType.DEFAULT);
                selectionFormGroup.controls.objectType.disable({onlySelf: true, emitEvent: false});
            } else {
                selectionFormGroup.controls.objectType.enable({onlySelf: true, emitEvent: false});
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
    private buildUpdateHook(): Observable<ISerFormResponse> {

        const observer = new Observable<ISerFormResponse>((obs) => {

            const fields     = this.selectionForm.getRawValue();

            let selection = this.currentApp.report.template.selections[0];
            if (!selection) {
                selection = new SelectionModel();
                this.currentApp.report.template.selections = [selection];
            }

            selection.values  = fields.selection.values;
            selection.name    = fields.selection.name;
            selection.type    = fields.type;

            selection.objectType = fields.selection.type === SelectionType.Dynamic
                ? SelectionObjectType.HIDDEN_BOOKMARK
                : fields.selection.objectType;

            obs.next({
                errors: [],
                valid: this.selectionForm.valid,
            });
        });

        return observer;
    }
}
