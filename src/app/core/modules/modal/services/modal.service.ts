import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ModalComponent } from '../components/modal.component';
import { MODAL_OVERLAY_CTRL, MODAL_OVERLAY_DATA } from '../api/modal-content.injector';
import { ModalControl } from './modal-control';
import { IModalData, IOverlayConfig } from '../api/modal-config.interface';
import { DEFAULT_OVERLAY_CONFIGURATION } from '../api/modal.config';

@Injectable()
export class ModalService {

    private overlay: Overlay;

    private injector: Injector;

    constructor(
        overlay: Overlay,
        injector: Injector
    ) {
        this.overlay  = overlay;
        this.injector = injector;
    }

    /**
     * open modal
     *
     * @param {*} body
     * @memberof ModalService
     */
    public open(data: IModalData, configuration: IOverlayConfig = {}): ModalControl {

        const config        = this.createOverlayConfig(configuration);
        const overlayRef    = this.overlay.create(config);
        const control = new ModalControl(overlayRef);

        const injector = this.createInjector(data, control);

        const overlayPortal = new ComponentPortal(ModalComponent, null, injector);
        overlayRef.attach(overlayPortal);

        return control;
    }

    /**
     * generate overlay configuration
     *
     * @private
     * @returns {OverlayConfig}
     * @memberof ModalService
     */
    private createOverlayConfig(config): OverlayConfig {

        const positionStrategy = this.overlay.position()
            .global()
            .centerVertically()
            .centerHorizontally();

        const overlayConfig: OverlayConfig = {
            ...DEFAULT_OVERLAY_CONFIGURATION,
            ...config,
            ...{
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.block(),
            },
        };

        return overlayConfig;
    }

    /**
     * create portal injector
     *
     * @private
     * @param {Component} component
     * @param {OverlayRef} overlayRef
     * @returns {PortalInjector}
     * @memberof ModalService
     */
    private createInjector(data: IModalData, control: ModalControl): PortalInjector {
        const tokens = new WeakMap();
        tokens.set(MODAL_OVERLAY_DATA, data);
        tokens.set(MODAL_OVERLAY_CTRL, control);
        return new PortalInjector(this.injector, tokens);
    }
}
