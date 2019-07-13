import { Component, Inject } from '@angular/core';
import { MODAL_OVERLAY_CTRL, MODAL_DIALOG_DATA } from '../../api/modal-content.injector';
import { ModalControl } from '../../services/modal-control';
import { IModalDialogData } from '../../api/modal-config.interface';

@Component({
    selector: 'smc-overlay-message',
    templateUrl: 'message.component.html',
    styleUrls: ['message.component.scss']
})
export class OverlayMessageComponent {

    public dialogData: IModalDialogData;

    public dialogCtrl: ModalControl;

    constructor(
        @Inject(MODAL_DIALOG_DATA)  data: IModalDialogData,
        @Inject(MODAL_OVERLAY_CTRL) ctrl: ModalControl
    ) {
        this.dialogData = data;
        this.dialogCtrl = ctrl;
    }

    public onClose() {
        this.dialogCtrl.close();
    }
}
