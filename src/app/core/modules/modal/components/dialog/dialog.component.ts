import { Component, OnInit, Inject } from '@angular/core';
import { MODAL_DIALOG_DATA, MODAL_OVERLAY_CTRL } from '../../api/modal-content.injector';
import { IModalDialogData } from '../../api/modal-config.interface';

@Component({
    selector: 'app-overlay-dialog',
    templateUrl: 'dialog.component.html'
})
export class OverlayDialogComponent {

    public dialogData: IModalDialogData;

    constructor(
        @Inject(MODAL_DIALOG_DATA)  data: IModalDialogData,
    ) {
        this.dialogData = data;
    }
}
