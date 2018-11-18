import { ComponentType } from '@angular/cdk/portal';
import { IControlConstructor } from './control.interface';

export interface IModalData<T> {

    bodyComponent?: ComponentType<T>;

    class?: string;

    control?: IControlConstructor;

    footerComponent?: ComponentType<any>;

    title: string;
}

export interface IModalDialogData {
    message: string;
}

export interface IOverlayConfig {

    panelClass?: string[];

    hasBackdrop?: boolean;

    backdropClass?: string;
}
