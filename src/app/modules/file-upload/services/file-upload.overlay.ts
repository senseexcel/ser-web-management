import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { FileUploadComponent } from '../components/file-upload.component';
import { FILEUPLOAD_URL, FILEUPLOAD_OVERLAY_CTRL } from '../model/tokens';
import { OverlayCtrl } from './overlay-control';

@Injectable()
export class FileUploadOverlay {

    constructor(
        private overlay: Overlay,
        private injector: Injector
    ) { }

    public open(url: string): OverlayCtrl {
        const overlayConfig = this.createConfig();
        const overlayRef: OverlayRef = this.overlay.create(overlayConfig);
        const overlayCtrl = new OverlayCtrl(overlayRef);

        this.attachOverlay(overlayRef, url, overlayCtrl);
        return overlayCtrl;
    }

    /**
     *
     */
    private createConfig(): OverlayConfig {

        const position = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const config: OverlayConfig = {
            hasBackdrop: true,
            backdropClass: 'fileupload--backdrop',
            positionStrategy: position,
            scrollStrategy: this.overlay.scrollStrategies.block()
        };

        return config;
    }

    /**
     *
     */
    private attachOverlay(overlayRef: OverlayRef, url: string, ctrl: OverlayCtrl) {
        const injector = this.createInjector(url, ctrl);
        const overlayPortal = new ComponentPortal(FileUploadComponent, null, injector);
        overlayRef.attach(overlayPortal);
    }

    private createInjector(url: string, ctrl: OverlayCtrl) {
        const injectorMap = new WeakMap();
        injectorMap.set(FILEUPLOAD_URL, url);
        injectorMap.set(FILEUPLOAD_OVERLAY_CTRL, ctrl);
        return new PortalInjector(this.injector, injectorMap);
    }
}
