import { Injectable, Injector, InjectionToken } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ModalComponent } from '../components/modal.component';
import { MODAL_OVERLAY_CTRL, MODAL_OVERLAY_DATA, MODAL_DIALOG_DATA, MODAL_DIALOG_ENABLE_SWITCH_OFF } from '../api/modal-content.injector';
import { ModalControl, DialogControl } from './modal-control';
import { IModalData, IOverlayConfig, IModalDialogData } from '../api/modal-config.interface';
import { DEFAULT_OVERLAY_CONFIGURATION } from '../api/modal.config';
import { OverlayDialogComponent } from '../components/dialog/dialog.component';
import { OverlayMessageComponent } from '../components/message/message.component';
import { DialogFooterComponent } from '../components/dialog/dialog-footer.component';
import { MessageFooterComponent } from '../components/message/message-footer.component';
import { IControl } from '../api/control.interface';
import { I18nTranslation } from '@smc/modules/smc-common/i18n';

@Injectable()
export class ModalService {

    private overlay: Overlay;

    private injector: Injector;

    constructor(
        overlay: Overlay,
        injector: Injector
    ) {
        this.overlay = overlay;
        this.injector = injector;
    }

    /**
     * open modal
     *
     * @param {*} body
     * @memberof ModalService
     */
    public open<T>(data: IModalData<T>, configuration: IOverlayConfig = {}): IControl {

        const overlayRef = this.createOverlay(configuration);
        const control = new (data.control || ModalControl)(overlayRef);
        const tokens = this.createInjectionTokens(data, control);
        const injector = this.createInjector(tokens);
        const overlayPortal = new ComponentPortal(ModalComponent, null, injector);

        overlayRef.attach(overlayPortal);

        return control;
    }

    /**
     *  factory method to create a dialog overlay
     *
     * @returns {DialogControl}
     * @memberof ModalService
     */
    public openDialog(
        title: string,
        msg: I18nTranslation,
        configuration: IOverlayConfig = {}
    ): DialogControl {

        // create dialog modal
        const overlayData: IModalData<OverlayDialogComponent> = {
            title,
            bodyComponent: OverlayDialogComponent,
            footerComponent: DialogFooterComponent
        };
        const dialogData: IModalDialogData = {message: msg};
        const overlayRef = this.createOverlay(configuration);
        const control = new DialogControl(overlayRef);
        const tokens = this.createInjectionTokens(overlayData, control);

        tokens.set(MODAL_DIALOG_DATA, dialogData);

        /** create injector and portal component */
        const injector = this.createInjector(tokens);
        const overlayPortal = new ComponentPortal(ModalComponent, null, injector);

        /** attach overlay  */
        overlayRef.attach(overlayPortal);

        return control;
    }

    /**
     *  factory method to create a message overlay
     *
     * @returns {ModalControl}
     * @memberof ModalService
     */
    public openMessageModal(
        title: string,
        msg: I18nTranslation,
        configuration: IOverlayConfig = {},
        dismisable = false
    ): ModalControl {

        // create dialog modal
        const overlayData: IModalData<OverlayMessageComponent> = {
            title,
            bodyComponent: OverlayMessageComponent,
            footerComponent: MessageFooterComponent,
        };

        /** create injector data for dialog data */
        const dialogData: IModalDialogData = {message: msg};
        const overlayRef = this.createOverlay(configuration);
        const control = new ModalControl(overlayRef);
        const tokens = this.createInjectionTokens(overlayData, control);

        tokens.set(MODAL_DIALOG_DATA, dialogData);
        tokens.set(MODAL_DIALOG_ENABLE_SWITCH_OFF, dismisable);

        /** create injector and portal component */
        const injector = this.createInjector(tokens);
        const overlayPortal = new ComponentPortal(ModalComponent, null, injector);

        /** attach overlay  */
        overlayRef.attach(overlayPortal);

        return control;
    }

    /**
     *  factory method to create a message overlay
     *
     * @returns {ModalControl}
     * @memberof ModalService
     */
    public openInfoModal(
        msg: I18nTranslation,
        configuration: IOverlayConfig = {},
        dismisable = false
    ): ModalControl {

        // create dialog modal
        const overlayData: IModalData<OverlayMessageComponent> = {
            title: '',
            bodyComponent: OverlayMessageComponent,
        };

        /** create injector data for dialog data */
        const dialogData: IModalDialogData = {message: msg};
        const overlayRef = this.createOverlay(configuration);
        const control = new ModalControl(overlayRef);
        const tokens = this.createInjectionTokens(overlayData, control);

        tokens.set(MODAL_DIALOG_DATA, dialogData);
        tokens.set(MODAL_DIALOG_ENABLE_SWITCH_OFF, dismisable);

        /** create injector and portal component */
        const injector = this.createInjector(tokens);
        const overlayPortal = new ComponentPortal(ModalComponent, null, injector);

        /** attach overlay  */
        overlayRef.attach(overlayPortal);

        return control;
    }

    /**
     *
     *
     * @private
     * @param {IOverlayConfig} [overlayConfig={}]
     * @returns {OverlayRef}
     * @memberof ModalService
     */
    private createOverlay(overlayConfig: IOverlayConfig = {}): OverlayRef {
        const config = this.createOverlayConfig(overlayConfig);
        const overlayRef = this.overlay.create(config);
        return overlayRef;
    }

    /**
     * generate overlay configuration
     *
     * @private
     * @returns {OverlayConfig}
     * @memberof ModalService
     */
    private createOverlayConfig(config: IOverlayConfig): OverlayConfig {

        const positionStrategy = this.overlay.position()
            .global()
            .centerVertically()
            .centerHorizontally();

        const mergedConfig = { ...DEFAULT_OVERLAY_CONFIGURATION, ...config };
        mergedConfig.panelClass = [...DEFAULT_OVERLAY_CONFIGURATION.panelClass, ...config.panelClass || []];

        const overlayConfig: OverlayConfig = {
            ...mergedConfig,
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
    private createInjector(tokens: WeakMap<InjectionToken<any>, any>): PortalInjector {
        return new PortalInjector(this.injector, tokens);
    }

    /**
     *
     *
     * @private
     * @param {IModalData<any>} data
     * @param {ModalControl} control
     * @returns {WeakMap<InjectionToken<any>, any>}
     * @memberof ModalService
     */
    private createInjectionTokens(data: IModalData<any>, control: IControl): WeakMap<InjectionToken<any>, any> {
        const tokens = new WeakMap();
        tokens.set(MODAL_OVERLAY_DATA, data);
        tokens.set(MODAL_OVERLAY_CTRL, control);
        return tokens;
    }
}
