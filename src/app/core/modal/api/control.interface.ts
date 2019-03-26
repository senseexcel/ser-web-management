import { Subject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';

export interface IControl {

    readonly onClose: Subject<boolean>;

    close(): void;
}

export type IControlConstructor = new(overlayRef: OverlayRef, ...args) => IControl;
