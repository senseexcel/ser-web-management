import { InjectionToken } from '@angular/core';

export interface IOverlayConfig {

    panelClass?: string;

    backdropClass?: string;
}

export const OVERLAY_CONTROL = new InjectionToken('overlay remote control');
