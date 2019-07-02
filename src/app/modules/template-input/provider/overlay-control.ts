import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateInputOverlayService } from './templateinput-overlay.service';

export class OverlayCtrl {

    constructor(
        private overlayRef: OverlayRef,
        private inputService: TemplateInputOverlayService
    ) { }

    public close() {
        this.overlayRef.dispose();
    }

    public select(value: string) {
        this.inputService.selectContent(value);
    }
}
