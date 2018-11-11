import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { FormControl, FormBuilder } from '@angular/forms';
import { debounceTime, takeUntil, take, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '@core/modules/modal/services/modal.service';

@Component({
    selector: 'app-license-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.scss']
})

export class EditorComponent implements OnDestroy, OnInit {

    public content: string;
    public input: FormControl;
    public isReady = false;

    private formBuilder: FormBuilder;
    private isDestroyed$: Subject<boolean>;
    private license: License;
    private modal: ModalService;

    constructor(
        license: License,
        formBuilder: FormBuilder,
        modal: ModalService
    ) {
        this.formBuilder = formBuilder;
        this.isDestroyed$ = new Subject();
        this.license = license;
        this.modal = modal;
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    ngOnInit() {

        this.input = this.createTextArea();
        this.license.onload$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((license: LicenseModel) => {
                this.input.setValue(license.raw, {emitEvent: false});
                this.isReady = true;
            });
    }

    /**
     * fetch license data from server
     *
     * @memberof EditorComponent
     */
    public fetchLicense() {
        this.license.fetchLicense()
            .subscribe(
                () => {},
                // error
                () => {
                    this.modal.openMessageModal('Error', 'Could not fetch license');
                });
    }

    private createTextArea(): FormControl {
        const control = this.formBuilder.control('');
        control.valueChanges
            .pipe(
                debounceTime(250),
                takeUntil(this.isDestroyed$)
            )
            .subscribe((value) => {
                this.license.updateLicense(value);
            });

        return control;
    }
}
