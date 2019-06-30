import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, fromEvent, Subject } from 'rxjs';
import { OverlayCtrl } from '../provider/overlay-control';
import { TemplateInputOverlayService } from '../provider/templateinput-overlay.service';
import { takeUntil, switchMap } from 'rxjs/operators';

/**
 * directive which triggers show templateinput overlay
 * if user click with mouse on element
 *
 * @example
 * <button type="button" smcTemplateInputSelect>Select Input Template</button>
 */
@Directive({ selector: '[smcTemplateInputSelect]' })
export class TemplateInputSelectDirective implements OnInit, OnDestroy {

    @Output()
    public select: EventEmitter<string>;

    private overlayCtrl: OverlayCtrl;

    private destroy$: Subject<boolean>;

    /**
     * Creates an instance of TemplateInputSelectDirective.
     */
    constructor(
        private el: ElementRef,
        private overlayService: TemplateInputOverlayService
    ) {
        this.destroy$ = new Subject();
        this.select = new EventEmitter();
    }

    /**
     * registers click event on element
     */
    public ngOnInit() {
        fromEvent(this.el.nativeElement, 'click').pipe(
            takeUntil(this.destroy$),
            switchMap(() => {
                this.overlayCtrl = this.overlayService.open();
                return this.overlayService.onSelect();
            })
        ).subscribe((path) => {
            this.select.emit(path);
            this.overlayCtrl.close();
            this.overlayCtrl = null;
        });
    }

    /**
     * directive gets destroyed
     */
    public ngOnDestroy() {
        this.destroy$.next(true);
        this.overlayCtrl = null;
        this.overlayService = null;
    }
}
