import { Component, OnInit, Inject } from '@angular/core';
import { MODAL_OVERLAY_CTRL, MODAL_DIALOG_DATA } from '../../api/modal-content.injector';
import { ModalControl } from '../../services/modal-control';

@Component({
    selector: 'app-dialog-message-footer',
    templateUrl: 'message-footer.component.html',
    styleUrls: ['message-footer.component.scss']
})

export class MessageFooterComponent {

    public dialogCtrl: ModalControl;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: ModalControl
    ) {
        this.dialogCtrl = ctrl;
    }

    public onClose() {
        this.dialogCtrl.close();
    }
}
