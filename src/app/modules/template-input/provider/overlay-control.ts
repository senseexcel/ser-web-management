import { OverlayRef } from '@angular/cdk/overlay';

export class OverlayCtrl {

    constructor(
        private overlayRef: OverlayRef
    ) { }

    public close() {
        this.overlayRef.dispose();
    }
}
