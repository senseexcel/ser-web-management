import { Component, Inject } from '@angular/core';
import { OverlayCtrl } from '../provider/overlay-control';
import { OVERLAY_CONTROL } from '../api/overlay-config';

@Component({
    selector: 'smc-templateinput-overlay',
    templateUrl: 'template-overlay.component.html',
    styleUrls: ['./template-overlay.component.scss']
})
export class TemplateOverlayComponent {

    public selectedLibary: string = null;

    public constructor(
        @Inject(OVERLAY_CONTROL) private overlayCtrl: OverlayCtrl
    ) {}

    public openLibrary(id: string) {
        this.selectedLibary = id;
    }

    public close() {
        this.overlayCtrl.close();
    }
}
