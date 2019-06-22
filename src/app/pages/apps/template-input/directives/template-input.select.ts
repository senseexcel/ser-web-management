import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, fromEvent, Subject } from 'rxjs';
import { OverlayCtrl } from '../provider/overlay-control';
import { TemplateInputOverlayService } from '../provider/templateinput-overlay.service';
import { tap } from 'rxjs/internal/operators/tap';
import { takeUntil } from 'rxjs/operators';

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

    /**
     * click subscription
     */
    private clickSub: Subscription;

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
        this.overlayService.onSelect()
            .pipe(takeUntil(this.destroy$))
            .subscribe((path) => {
                this.select.emit(path);
                this.overlayCtrl.close();
            });

        fromEvent(this.el.nativeElement, 'click')
            .pipe(
                tap(() => {
                    if (!this.overlayCtrl) {
                        this.overlayCtrl = this.overlayService.create({
                            backdropClass: 'template-input--backdrop',
                            panelClass: 'template-input--overlay'
                        });
                    }
                }),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.toggleTemplateOverlay());
    }

    /**
     * directive gets destroyed
     */
    public ngOnDestroy() {
        this.destroy$.next(true);
        this.overlayCtrl = null;
        this.overlayService = null;
    }

    /**
     * enable templateinput overlay
     */
    private toggleTemplateOverlay() {
        this.overlayCtrl.show();
    }
}
