import { ComponentType } from '@angular/cdk/portal';
import { ModalControl } from '../services/modal-control';
import { IControlConstructor } from './control.interface';

export interface IModalData<T> {

    title: string;

    bodyComponent: ComponentType<T>;

    footerComponent?: ComponentType<any>;

    control?: IControlConstructor;
}

export interface IModalDialogData {
    message: string;
}

export interface IOverlayConfig {

    panelClass?: string;

    hasBackdrop?: boolean;

    backdropClass?: string;
}
