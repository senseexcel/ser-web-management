import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { MODAL_OVERLAY_CTRL } from '@smc/modules/modal/api/modal-content.injector';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'smc-license-insert-overlay',
    styleUrls: ['insert-overlay.component.scss'],
    templateUrl: 'insert-overlay.component.html'
})

export class InsertOverlayComponent implements AfterViewInit, OnDestroy, OnInit {

    public insertField: FormControl;
    public licenseValue = '';

    private ctrl: InsertOverlayControl;
    private formBuilder: FormBuilder;
    private isDestroyed$: Subject<boolean>;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: InsertOverlayControl,
        formBuilder: FormBuilder
    ) {
        this.formBuilder = formBuilder;
        this.ctrl = ctrl;
        this.isDestroyed$ = new Subject();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
    }

    ngOnInit() {
        this.ctrl.content = '';
        this.insertField = this.createInsertField();

        this.ctrl.update$.pipe(
            takeUntil(this.isDestroyed$)
        )
        .subscribe((content: string) => {
            this.insertField.setValue(content, {emitEvent: false});
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
                this.ctrl.content = val;
            });
        return control;
    }
}
