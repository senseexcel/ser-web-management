import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class ModalControl {

    public readonly onClose: Subject<boolean> = new Subject();

    private overlayRef: OverlayRef;

    public constructor(overlayRef: OverlayRef) {
        this.overlayRef = overlayRef;
    }

    public close() {
        this.overlayRef.dispose();
        this.onClose.next(true);
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
