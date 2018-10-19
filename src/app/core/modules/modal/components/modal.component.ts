import { Component, OnInit, Inject, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { MODAL_OVERLAY_CTRL, MODAL_OVERLAY_DATA } from '../api/modal-content.injector';
import { ModalControl } from '../services/modal-control';
import { IModalData } from '../api/modal-config.interface';

@Component({
    selector: 'app-ser-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

    @ViewChild('body', {read: ViewContainerRef})
    private bodyViewContainer: ViewContainerRef;

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
    private modalData: any;

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
        @Inject(MODAL_OVERLAY_DATA) data: IModalData,
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
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.modalData.content);
        this.bodyViewContainer.createComponent(factory);
    }

    /**
     * close modal
     *
     * @memberof ModalComponent
     */
    closeModal() {
        this.modalOverlayCtrl.close();
    }

    /**
     * component gets destroyed
     *
     * @memberof ModalComponent
     */
    ngOnDestroy() {
    }
}
