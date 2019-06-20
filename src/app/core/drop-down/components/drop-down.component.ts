import { Component, OnInit, ViewContainerRef, ViewChild, TemplateRef, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DropDownOverlay } from '../model/drop-down-overlay';
import { POSITION_BOTTOM_CENTER, POSITION_BOTTOM_LEFT } from '../model/positions';

@Component({
    selector: 'smc-drop-down',
    styleUrls: ['./drop-down.component.scss'],
    templateUrl: 'drop-down.component.html'
})

export class DropDownComponent implements OnInit {

    /**
     * class which will passed as panelClass for overlay component
     *
     * @type {string}
     * @memberof DropDownComponent
     */
    @Input()
    public hostClass: string[];

    @Input('label')
    public label: string;

    @Output()
    public show: EventEmitter<DropDownOverlay>;

    @Output()
    public close: EventEmitter<DropDownOverlay>;

    @ViewChild('arrowUp', { static: false })
    private arrowUpIcon: ElementRef;

    private overlay: Overlay;

    /**
     * template which holds drop down content
     *
     * @type {TemplateRef<any>}
     * @memberof SelectPopoverComponent
     */
    @ViewChild('contentWrapper', { static: true })
    public template: TemplateRef<any>;

    /**
     * drop down overlay
     *
     * @private
     * @type {DropDownOverlay}
     * @memberof DropDownComponent
     */
    private dropDownOverlay: DropDownOverlay;

    /**
     *
     *
     * @private
     * @type {ViewContainerRef}
     * @memberof SelectPopoverComponent
     */
    private viewContainerRef: ViewContainerRef;

    /**
     *Creates an instance of DropDownComponent.
     * @param {DropDownService} dropDownService
     * @param {ViewContainerRef} viewContainer
     * @memberof DropDownComponent
     */
    constructor(
        overlay: Overlay,
        viewContainer: ViewContainerRef
    ) {
        this.viewContainerRef = viewContainer;

        this.close   = new EventEmitter<DropDownOverlay>();
        this.overlay = overlay;
        this.show    = new EventEmitter<DropDownOverlay>();
    }

    /**
     * initialize component
     *
     * @memberof DropDownComponent
     */
    ngOnInit() {

        this.dropDownOverlay = this.createOverlay(this.template, this.viewContainerRef);

        /** register click event on document and skip if overlay is not visible */
        fromEvent(document, 'click')
            .pipe(filter(_ => this.dropDownOverlay.isVisible))
            .subscribe(() => {
                this.dropDownOverlay.close();
            });
    }

    /**
     * handle toggle for drop down menu
     *
     * @memberof DropDownComponent
     */
    public toggleDropDown(event) {
        event.stopPropagation();
        if (!this.dropDownOverlay.isVisible) {
            this.dropDownOverlay.show();
            this.show.emit(this.dropDownOverlay);
            return;
        }
        this.dropDownOverlay.close();
    }

    /**
     * show drop down overlay
     *
     * @param {TemplateRef<any>} template
     * @param {ViewContainerRef} viewContainer
     * @param {ElementRef} element
     * @param {IDropDownOverlayConfig} [config={}]
     * @memberof DropDownService
     */
    private createOverlay(
        template: TemplateRef<any>,
        viewContainer: ViewContainerRef
    ): DropDownOverlay {

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(viewContainer.element)
            .withViewportMargin(10)
            .withFlexibleDimensions(false)
            .withPositions([POSITION_BOTTOM_CENTER]);

        const overlayConfig = new OverlayConfig({
            panelClass: [...this.hostClass, 'smc-ui--drop-down'],
            positionStrategy
        });

        const overlayRef      = this.overlay.create(overlayConfig);
        const componentPortal = new TemplatePortal(template, viewContainer);
        const dropDownOverlay = new DropDownOverlay(overlayRef, componentPortal);

        /** register on position change to rearrange the arrow */
        positionStrategy.positionChanges.subscribe(() => {

            const rectOverlay = overlayRef.overlayElement.getBoundingClientRect();
            const rectSource  = viewContainer.element.nativeElement.getBoundingClientRect();

            const centerOverlayX = rectOverlay.left + rectOverlay.width / 2;
            const centerSourceX  = rectSource.left  + rectSource.width / 2;

            const deltaCenter = centerSourceX - centerOverlayX;

            this.arrowUpIcon.nativeElement.style.left      =  `${deltaCenter}px`;
        });

        return dropDownOverlay;
    }
}
