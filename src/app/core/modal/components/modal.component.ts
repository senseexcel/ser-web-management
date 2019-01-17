import { Component, OnInit, Inject, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MODAL_OVERLAY_CTRL, MODAL_OVERLAY_DATA } from '../api/modal-content.injector';
import { ModalControl } from '../services/modal-control';
import { IModalData } from '../api/modal-config.interface';
import { OverlayMessageComponent } from './message/message.component';
import { MessageFooterComponent } from './message/message-footer.component';

@Component({
    selector: 'app-ser-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    @ViewChild('body', {read: ViewContainerRef})
    private bodyViewContainer: ViewContainerRef;

    @ViewChild('footer', {read: ViewContainerRef})
    private footerViewContainer: ViewContainerRef;

    /**
     * component factory resolver to create component factory which is
     * included to view container for body, footer
     *
     * @private
     * @type {ComponentFactoryResolver}
     * @memberof ModalComponent
     */
    private componentFactoryResolver: ComponentFactoryResolver;

    /**
     * body component
     *
     * @private
     * @type {*}
     * @memberof ModalComponent
     */
    private modalData: IModalData<any>;

    /**
     * modal overlay control
     *
     * @private
     * @memberof ModalComponent
     */
    private modalOverlayCtrl: ModalControl;

    /**
     *Creates an instance of ModalComponent.
     * @param {*} body
     * @param {*} overlayCtrl
     * @param {ComponentFactoryResolver} resolver
     * @memberof ModalComponent
     */
    constructor(
        @Inject(MODAL_OVERLAY_DATA) data: IModalData<Component>,
        @Inject(MODAL_OVERLAY_CTRL) overlayCtrl: ModalControl,
        resolver: ComponentFactoryResolver
    ) {
        this.componentFactoryResolver = resolver;
        this.modalData = data;
        this.modalOverlayCtrl = overlayCtrl;
    }

    /**
     *
     *
     * @memberof ModalComponent
     */
    ngOnInit() {
        const bodyFactory = this.componentFactoryResolver.resolveComponentFactory(this.modalData.bodyComponent || OverlayMessageComponent);
        this.bodyViewContainer.createComponent(bodyFactory);

        if (this.modalData.footerComponent) {
            const footer = this.modalData.footerComponent || MessageFooterComponent;
            const footerFactory = this.componentFactoryResolver.resolveComponentFactory(footer);

            this.footerViewContainer.createComponent(footerFactory);
        }
    }

    /**
     * close modal
     *
     * @memberof ModalComponent
     */
    closeModal() {
        this.modalOverlayCtrl.close();
    }
}
