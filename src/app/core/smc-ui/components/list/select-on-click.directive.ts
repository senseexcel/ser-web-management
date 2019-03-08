import { Directive, Input, OnDestroy, OnInit, HostListener, HostBinding } from '@angular/core';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { DocumentKey, KeyCode } from '@smc/modules/smc-common/provider/document-key.service';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[smcSelectOnClick]',
})
export class SelectOnClickDirective<T> implements OnDestroy, OnInit {

    @Input()
    public multi = false;

    @Input()
    public selectionData: T;

    @HostBinding('class.selected')
    public selected = false;

    /**
     * selection model
     *
     * @private
     * @type {SelectionModel<any>}
     * @memberof SelectOnClickDirective
     */
    private model: SelectionModel<any>;

    /**
     * subject on element gets destroyed
     * remove all subscribtions
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof SelectOnClickDirective
     */
    private destroy$: Subject<boolean>;

    /**
     * flag we have multi selection and ctrl key pressed
     *
     * @private
     * @memberof SelectOnClickDirective
     */
    private ctrlKeyPressed = false;

    @Input()
    public set selectionModel(model: SelectionModel<any>) {
        this.model = model;
    }

    /**
     *Creates an instance of SelectOnClickDirective.
     * @param {DocumentKey} documentKey
     * @memberof SelectOnClickDirective
     */
    public constructor(
        private documentKey: DocumentKey
    ) {
        this.destroy$ = new Subject();
    }

    @HostListener('click')
    public handleClick() {
        if (this.model.isMultipleSelection() && !this.ctrlKeyPressed && !this.model.isEmpty()) {
            this.model.clear();
        }
        this.model.select(this.selectionData);
    }

    /**
     *
     *
     * @memberof SelectOnClickDirective
     */
    public ngOnInit() {
        this.documentKey.stateChange(KeyCode.CTRL)
            .pipe(takeUntil(this.destroy$))
            .subscribe((state: string) => {
                this.ctrlKeyPressed = state === 'pressed';
            });

        this.model.changed.subscribe(() => this.handleSelectionChanged());
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
    }

    private handleSelectionChanged() {
        this.selected = this.model.isSelected(this.selectionData);
    }
}
