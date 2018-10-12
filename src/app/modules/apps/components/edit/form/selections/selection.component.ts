import { Component, OnInit } from '@angular/core';
import { FormService } from '@core/modules/form-helper';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { ISerFormResponse } from '@apps/api/ser-form.response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectionObjectType } from '@core/modules/ser-report/model/selection.model';
import { SelectionType } from 'ser.api';

@Component({
    selector: 'app-edit-form-selections',
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
     * @type {FormService<ISerApp, ISerFormResponse>}
     * @memberof SelectionComponent
     */
    private formService: FormService<ISerApp, ISerFormResponse>;

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
     * @type {ISerApp}
     * @memberof SelectionComponent
     */
    private currentApp: ISerApp;

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
        formService: FormService<ISerApp, ISerFormResponse>
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
        .subscribe ((app: ISerApp) => {
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
        const formGroup: FormGroup = this.formBuilder.group({
            type: this.formBuilder.control(
                selectionSettings.type || SelectionType.Dynamic
            ),
            selection: this.formBuilder.group({
                name: this.formBuilder.control(
                    selectionSettings.name
                ),
                objectType: this.formBuilder.control(
                    SelectionObjectType.DEFAULT
                ),
                values: this.formBuilder.control(
                    selectionSettings.values ? selectionSettings.values[0] : ''
                )
            })
        });

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
            obs.next({
                data: [{
                    fields: this.selectionForm.getRawValue(),
                    group: 'selections',
                    path: 'template'
                }],
                errors: [],
                valid: this.selectionForm.valid,
            });
        });

        return observer;
    }
}
