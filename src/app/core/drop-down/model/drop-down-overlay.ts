import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { Portal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

export class DropDownOverlay {

    private overlayRef: OverlayRef;

    private portalHost: Portal<any>;

    private overlayIsVisible = false;

    public constructor(
        overlay: OverlayRef,
        portalHost: Portal<any>
    ) {
        this.overlayRef = overlay;
        this.portalHost = portalHost;
    }

    public show() {
        this.overlayRef.attach(this.portalHost);
        this.overlayIsVisible = true;
    }

    public close() {
        this.overlayRef.detach();
        this.overlayIsVisible = false;
    }

    public destoy() {
        this.overlayRef.dispose();
    }

    public get isVisible () {
        return this.overlayIsVisible;
    }
}
