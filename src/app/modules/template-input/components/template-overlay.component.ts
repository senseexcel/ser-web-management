import { Component, Inject, ViewChild } from '@angular/core';
import { OverlayCtrl } from '../provider/overlay-control';
import { OVERLAY_CONTROL } from '../api/overlay-config';
import { ContentListComponent } from './content-list';

@Component({
    selector: 'smc-templateinput-overlay',
    templateUrl: 'template-overlay.component.html',
    styleUrls: ['./template-overlay.component.scss']
})
export class TemplateOverlayComponent {

    @ViewChild(ContentListComponent, {read: ContentListComponent, static: true})
    private contentList: ContentListComponent;

    public selectedLibary: string = null;

    public constructor(
        @Inject(OVERLAY_CONTROL) private overlayCtrl: OverlayCtrl
    ) {}

    public openLibrary(id: string) {
        this.selectedLibary = id;
    }

    public libraryContentChanged() {
        this.reloadContent();
    }

    public reloadContent() {
        this.contentList.reload(this.selectedLibary);
    }

    public close() {
        this.overlayCtrl.close();
    }

    public selectTemplate(template) {
        this.overlayCtrl.select(template);
    }
}
