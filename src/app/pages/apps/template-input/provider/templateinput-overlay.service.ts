import { Injectable } from '@angular/core';
import { IOverlayConfig } from '../api/overlay-config';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TemplateOverlayComponent } from '../components/template-overlay.component';
import { OverlayCtrl } from './overlay-control';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TemplateInputOverlayService {

    private select$: Subject<string>;

    constructor (
        private overlay: Overlay
    ) {
        this.select$ = new Subject();
    }

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

    public onSelect(): Observable<string> {
        return this.select$.asObservable();
    }

    public selectContent(value: string) {
        this.select$.next(value);
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
