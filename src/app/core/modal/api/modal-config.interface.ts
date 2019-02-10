import { ComponentType } from '@angular/cdk/portal';
import { IControlConstructor } from './control.interface';
import { I18nTranslation } from '@smc/modules/smc-common/i18n/i18n-translation.interface';

export interface IModalData<T> {

    bodyComponent?: ComponentType<T>;

    class?: string;

    control?: IControlConstructor;

    footerComponent?: ComponentType<any>;

    title: string;
}

export interface IModalDialogData {
    message: I18nTranslation;
}

export interface IOverlayConfig {

    panelClass?: string[];

    hasBackdrop?: boolean;

    backdropClass?: string;
}
