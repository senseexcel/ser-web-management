import { Injectable } from '@angular/core';
import { IOverlayConfig } from '../api/overlay-config';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TemplateOverlayComponent } from '../components/template-overlay.component';
import { OverlayCtrl } from './overlay-control';

@Injectable()
export class TemplateInputOverlayService {

    constructor (
        private overlay: Overlay
    ) { }

    /**
     * open overlay and returns remote control
     */
    public create( config: IOverlayConfig ): OverlayCtrl {
        const overlayConfig = this.createOverlayConfig(config);
        const overlayRef = this.overlay.create(overlayConfig);
        const templateInputPortal = new ComponentPortal(TemplateOverlayComponent);

        overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

        return new OverlayCtrl(overlayRef, templateInputPortal);
    }

    private createOverlayConfig( config: IOverlayConfig ): OverlayConfig {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy,
        });
        return overlayConfig;
    }
}
