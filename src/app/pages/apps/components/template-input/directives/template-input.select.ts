import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { OverlayCtrl } from '../provider/overlay-control';
import { TemplateInputOverlayService } from '../provider/templateinput-overlay.service';
import { tap } from 'rxjs/internal/operators/tap';

/**
 * directive which triggers show templateinput overlay
 * if user click with mouse on element
 *
 * @example
 * <button type="button" smcTemplateInputSelect>Select Input Template</button>
 */
@Directive({ selector: '[smcTemplateInputSelect]' })
export class TemplateInputSelectDirective implements OnInit, OnDestroy {

    private overlayCtrl: OverlayCtrl;

    /**
     * click subscription
     */
    private clickSub: Subscription;

    /**
     * Creates an instance of TemplateInputSelectDirective.
     */
    constructor(
        private el: ElementRef,
        private overlayService: TemplateInputOverlayService
    ) { }

    /**
     * registers click event on element
     */
    public ngOnInit() {

        this.clickSub = fromEvent(this.el.nativeElement, 'click')
            .pipe(tap(() => {
                if (!this.overlayCtrl) {
                    this.overlayCtrl = this.overlayService.create({
                        backdropClass: 'template-input--backdrop',
                        panelClass: 'template-input--overlay'
                    });
                }
            }))
            .subscribe(() => this.toggleTemplateOverlay());
    }

    /**
     * directive gets destroyed
     */
    public ngOnDestroy() {

        this.clickSub.unsubscribe();

        this.clickSub = null;
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
