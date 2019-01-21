import { Component, OnInit, ViewContainerRef, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { DropDownOverlay } from '@smc/modules/drop-down/model/drop-down-overlay';
import {
    POSITION_TOP_CENTER,
    POSITION_BOTTOM_CENTER,
    POSITION_TOP_LEFT,
    POSITION_BOTTOM_LEFT
} from '@smc/modules/drop-down/model/positions';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
    selector: 'smc-tooltip',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['./tooltip.component.scss']
})

export class TooltipComponent implements OnInit {

    private hostClass: string | string[];

    /**
     * template which holds drop down content
     *
     * @type {TemplateRef<any>}
     * @memberof SelectPopoverComponent
     */
    @ViewChild('contentWrapper')
    public template: TemplateRef<any>;

    /**
     *Creates an instance of DropDownComponent.
     * @param {DropDownService} dropDownService
     * @param {ViewContainerRef} viewContainer
     * @memberof DropDownComponent
     */
    constructor(
        private overlay: Overlay,
        private viewContainer: ViewContainerRef
    ) {
    }

    ngOnInit() {}

    private createOverlay(
        template: TemplateRef<any>,
        viewContainer: ViewContainerRef
    ): DropDownOverlay {

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(viewContainer.element)
            .withViewportMargin(10)
            .withFlexibleDimensions(false)
            .withPositions([
                POSITION_TOP_CENTER,
                POSITION_TOP_LEFT,
                POSITION_BOTTOM_CENTER,
                POSITION_BOTTOM_LEFT,
            ]);

        const overlayConfig = new OverlayConfig({
            panelClass: this.hostClass,
            positionStrategy
        });

        const overlayRef      = this.overlay.create(overlayConfig);
        const componentPortal = new TemplatePortal(template, viewContainer);
        const dropDownOverlay = new DropDownOverlay(overlayRef, componentPortal);

        return dropDownOverlay;
    }
}
