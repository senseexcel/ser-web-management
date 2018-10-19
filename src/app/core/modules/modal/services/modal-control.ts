import { OverlayRef } from '@angular/cdk/overlay';

export class ModalControl {

    private overlayRef: OverlayRef;

    public constructor(overlayRef: OverlayRef) {
        this.overlayRef = overlayRef;
    }

    public close() {
        this.overlayRef.dispose();
    }
}
