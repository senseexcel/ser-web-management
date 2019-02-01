import { Component, OnInit, Inject } from '@angular/core';
import { MODAL_DIALOG_DATA } from '../../api/modal-content.injector';
import { IModalDialogData } from '../../api/modal-config.interface';

@Component({
    selector: 'smc-overlay-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class OverlayDialogComponent {

    public dialogData: IModalDialogData;

    constructor(
        @Inject(MODAL_DIALOG_DATA)  data: IModalDialogData,
    ) {
        this.dialogData = data;
    }
}
