import { InjectionToken, Type } from '@angular/core';

export const MODAL_OVERLAY_DATA = new InjectionToken<any>('ModalOverlayData');
export const MODAL_OVERLAY_CTRL = new InjectionToken<any>('ModalOverlayControl');
export const MODAL_DIALOG_DATA  = new InjectionToken<any>('ModalDialogData');
export const MODAL_DIALOG_ENABLE_SWITCH_OFF = new InjectionToken<any>('ModalDissmisAble', { providedIn: 'root', factory: () => false});
