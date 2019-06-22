import { Component } from '@angular/core';

@Component({
    selector: 'smc-templateinput-overlay',
    templateUrl: 'template-overlay.component.html',
    styleUrls: ['./template-overlay.component.scss']
})
export class TemplateOverlayComponent {

    public selectedLibary: string = null;

    public openLibrary(id: string) {
        this.selectedLibary = id;
    }
}
