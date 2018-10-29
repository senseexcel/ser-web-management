import { Component, OnInit, Inject } from '@angular/core';
import { MODAL_OVERLAY_CTRL } from '../../api/modal-content.injector';
import { DialogControl } from '../../services/modal-control';

@Component({
    selector: 'app-modal-dialog-footer',
    templateUrl: 'dialog-footer.component.html',
    styleUrls: ['dialog-footer.component.scss']
})

export class DialogFooterComponent implements OnInit {

    private dialogCtrl: DialogControl;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: DialogControl
    ) {
        this.dialogCtrl = ctrl;
    }

    ngOnInit() { }

    public onConfirm() {
        this.dialogCtrl.confirm();
    }

    public onCancel() {
        this.dialogCtrl.reject();
    }
}
