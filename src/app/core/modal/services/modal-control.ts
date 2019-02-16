import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { IControl } from '../api/control.interface';

export class ModalControl implements IControl {

    private onClose$: Subject<boolean> = new Subject();

    private overlayRef: OverlayRef;

    private modalShowAgain: boolean;

    public constructor(overlayRef: OverlayRef) {
        this.overlayRef = overlayRef;
    }

    public close() {
        this.overlayRef.dispose();
        this.onClose$.next();
        this.onClose$.complete();
    }

    public get onClose(): Subject<boolean> {
        return this.onClose$;
    }

    public set showAgain(showAgain: boolean) {
        this.modalShowAgain = showAgain;
    }

    public get showAgain(): boolean {
        return this.modalShowAgain;
    }
}

export class DialogControl extends ModalControl {

    public readonly switch: Subject<boolean> = new Subject();

    public confirm() {
        this.switch.next(true);
        this.close();
    }

    public reject() {
        this.switch.next(false);
        this.close();
    }
}
