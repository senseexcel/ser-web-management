import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TemplateOverlayComponent } from '../components/template-overlay.component';

export class OverlayCtrl {

    constructor(
        private overlayRef: OverlayRef,
        private overlayPortal: ComponentPortal<TemplateOverlayComponent>
    ) { }

    public show() {
        this.overlayRef.attach(this.overlayPortal);
    }

    public close() {
        this.overlayRef.dispose();
    }
}
