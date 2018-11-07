import { Subject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';

export interface IControl {

    readonly onClose: Subject<boolean>;

    close(): void;
}

export interface IControlConstructor {
    new(overlayRef: OverlayRef): IControl;
}
