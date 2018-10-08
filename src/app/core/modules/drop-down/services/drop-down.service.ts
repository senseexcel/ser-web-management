import { Injectable, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { POSITION_BOTTOM_LEFT, POSITION_BOTTOM_CENTER } from '../model/positions';
import { IDropDownOverlayConfig } from '../api/drop-down-overlay-config.interface';
import { DropDownOverlay } from '@core/modules/drop-down/model/drop-down-overlay';
import { fromEvent } from 'rxjs';

@Injectable()
export class DropDownService {

    private overlay: Overlay;

    constructor(overlay: Overlay) {
        this.overlay = overlay;
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
    public create(
        template: TemplateRef<any>,
        viewContainer: ViewContainerRef,
        config: IDropDownOverlayConfig = {}
    ): DropDownOverlay {

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(viewContainer.element)
            .withFlexibleDimensions(false)
            .withPositions(config.positions || [POSITION_BOTTOM_CENTER, POSITION_BOTTOM_LEFT]);

        const overlayConfig = new OverlayConfig({
            panelClass: config.panelClass || '',
            positionStrategy
        });

        const overlayRef      = this.overlay.create(overlayConfig);
        const componentPortal = new TemplatePortal(template, viewContainer);
        const dropDownOverlay = new DropDownOverlay(overlayRef, componentPortal);

        return dropDownOverlay;
    }
}

