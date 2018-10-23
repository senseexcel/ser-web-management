import { OverlayDialogComponent } from '../components/dialog/dialog.component';
import { ComponentType } from '@angular/cdk/portal';

export interface IModalData<T> {

    title: string;

    bodyComponent: ComponentType<T>;

    footerComponent?: ComponentType<any>;
}

export interface IModalDialogData {
    message: string;
}

export interface IOverlayConfig {

    panelClass?: string;

    hasBackdrop?: boolean;

    backdropClass?: string;
}
