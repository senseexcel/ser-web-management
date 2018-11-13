import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MODAL_OVERLAY_CTRL } from '@core/modules/modal/api/modal-content.injector';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';

@Component({
    selector: 'app-license-insert-overlay',
    styleUrls: ['insert-overlay.component.scss'],
    templateUrl: 'insert-overlay.component.html'
})

export class InsertOverlayComponent implements AfterViewInit, OnInit {

    public insertField: FormControl;

    public licenseValue = '';

    private ctrl: InsertOverlayControl;

    private formBuilder: FormBuilder;

    private license: License;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: InsertOverlayControl,
        formBuilder: FormBuilder,
        license: License
    ) {
        this.formBuilder = formBuilder;
        this.ctrl = ctrl;
        this.license = license;
    }

    ngOnInit() {
        this.ctrl.content = '';
        this.insertField = this.createInsertField();

        this.ctrl.update$.subscribe((content: string) => {
            this.insertField.setValue(content, {emitEvent: false});
        });
    }

    ngAfterViewInit() {
        this.license.onload$.subscribe((model: LicenseModel) => {
            this.ctrl.update(model.raw);
        });
    }

    /**
     * create insert form field
     *
     * @private
     * @returns {FormControl}
     * @memberof InsertOverlayComponent
     */
    private createInsertField(): FormControl {
        const control = this.formBuilder.control('');
        control.valueChanges.pipe(debounceTime(400))
            .subscribe((val) => {
                this.ctrl.content = val.replace(/\n/g, ' ');
            });
        return control;
    }
}
