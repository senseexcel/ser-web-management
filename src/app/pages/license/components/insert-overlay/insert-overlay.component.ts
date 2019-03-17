import { Component, OnInit, Inject } from '@angular/core';
import { MODAL_OVERLAY_DATA } from '@smc/modules/modal/api/modal-content.injector';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ILicenseModalData } from '../../api/license-modal.data';

@Component({
    selector: 'smc-license-insert-overlay',
    styleUrls: ['insert-overlay.component.scss'],
    templateUrl: 'insert-overlay.component.html'
})

export class InsertOverlayComponent implements  OnInit {

    public insertField: FormControl;
    public licenseValue = '';

    private formBuilder: FormBuilder;
    private isDestroyed$: Subject<boolean>;

    constructor(
        @Inject(MODAL_OVERLAY_DATA) private data: ILicenseModalData<any>,
        formBuilder: FormBuilder
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.insertField = this.createInsertField();
    }

    private createInsertField(): FormControl {
        const control = this.formBuilder.control(this.data.license.toString());
        return control;
    }
}
