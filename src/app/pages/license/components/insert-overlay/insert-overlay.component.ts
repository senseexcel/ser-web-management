import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MODAL_OVERLAY_DATA, MODAL_OVERLAY_CTRL } from '@smc/modules/modal/api/modal-content.injector';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ILicenseModalData } from '../../api/license-modal.data';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { ViewportControl } from 'ngx-customscrollbar';

@Component({
    selector: 'smc-license-insert-overlay',
    styleUrls: ['insert-overlay.component.scss'],
    templateUrl: 'insert-overlay.component.html',
    viewProviders: [ViewportControl]
})

export class InsertOverlayComponent implements OnInit, OnDestroy {

    public insertField: FormControl;
    public licenseValue = '';

    private formBuilder: FormBuilder;
    private isDestroyed$: Subject<boolean>;

    constructor(
        @Inject(MODAL_OVERLAY_DATA) private data: ILicenseModalData<any>,
        @Inject(MODAL_OVERLAY_CTRL) private ctrl: InsertOverlayControl,
        formBuilder: FormBuilder
    ) {
        this.isDestroyed$ = new Subject();
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        const licenseData = this.data.license.toString();
        this.ctrl.content = licenseData;
        this.insertField = this.formBuilder.control(licenseData);

        this.insertField.valueChanges
            .pipe( takeUntil(this.isDestroyed$))
            .subscribe((val) => this.ctrl.content = val);
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
        this.insertField = null;
    }
}
