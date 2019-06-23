import { Injectable, Injector } from '@angular/core';
import { IOverlayConfig, OVERLAY_CONTROL } from '../api/overlay-config';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { TemplateOverlayComponent } from '../components/template-overlay.component';
import { OverlayCtrl } from './overlay-control';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TemplateInputOverlayService {

    private select$: Subject<string>;

    constructor (
        private injector: Injector,
        private overlay: Overlay
    ) {
        this.select$ = new Subject();
    }

    /**
     * open overlay and returns remote control
     */
    public open(): OverlayCtrl {

        const overlayConfig = this.createOverlayConfig({
            backdropClass: 'template-input--backdrop',
            panelClass: 'template-input--overlay'
        });

        // create portal host, where overlay will attached
        const overlayRef = this.overlay.create(overlayConfig);

        // create remote control
        const remoteCtrl = new OverlayCtrl(overlayRef);

        // attach overlay to portal host
        this.attachOverlay(overlayRef, remoteCtrl);

        overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
        return remoteCtrl;
    }

    public onSelect(): Observable<string> {
        return this.select$.asObservable();
    }

    public selectContent(value: string) {
        this.select$.next(value);
    }

    private createOverlayConfig(config: IOverlayConfig): OverlayConfig {
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

    /**
     * attach overlay to portal host
     */
    private attachOverlay(overlayRef: OverlayRef, ctrl: OverlayCtrl) {
        // create injector
        const injector = this.createInjector(ctrl);

        // create overlay component portal which will added to portal host
        const containerPortal = new ComponentPortal(TemplateOverlayComponent, null, injector);

        // attach container portal to portal host
        const containerRef = overlayRef.attach(containerPortal);
    }

    /**
     * create custom injector we will attach to overlay
     * so we could share remote control with components inside the overlay
     */
    private createInjector(ctrl: OverlayCtrl): PortalInjector {

        // Instantiate new WeakMap for our custom injection tokens
        const injectionTokens = new WeakMap();

        // Set custom injection tokens
        injectionTokens.set(OVERLAY_CONTROL, ctrl);

        // Instantiate new PortalInjector
        return new PortalInjector(this.injector, injectionTokens);
    }
}
