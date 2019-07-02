import { Directive, ElementRef, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { OverlayCtrl } from '../provider/overlay-control';
import { TemplateInputOverlayService } from '../provider/templateinput-overlay.service';
import { take } from 'rxjs/operators';

/**
 * directive which triggers show templateinput overlay
 * if user click with mouse on element
 *
 * @example
 * <button type="button" smcTemplateInputSelect>Select Input Template</button>
 */
@Directive({ selector: '[smcTemplateInputSelect]' })
export class TemplateInputSelectDirective implements OnDestroy {

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

    @HostListener('click', ['$event'])
    public openOverflay(event: MouseEvent) {
        event.stopPropagation();

        this.overlayCtrl = this.overlayService.open();
        this.overlayService.onSelect()
            .pipe(take(1))
            .subscribe({
                next: (path) => {
                    this.select.emit(path);
                    this.overlayCtrl.close();
                    this.overlayCtrl = null;
                }
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
