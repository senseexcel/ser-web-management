import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MODAL_OVERLAY_CTRL, MODAL_DIALOG_ENABLE_SWITCH_OFF } from '../../api/modal-content.injector';
import { ModalControl } from '../../services/modal-control';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-dialog-message-footer',
    templateUrl: 'message-footer.component.html',
    styleUrls: ['message-footer.component.scss']
})

export class MessageFooterComponent implements OnInit {

    public dialogCtrl: ModalControl;

    public switchOffEnabled: boolean;

    public switchOffFormControl: FormControl;

    private formBuilder: FormBuilder;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: ModalControl,
        @Optional() @Inject(MODAL_DIALOG_ENABLE_SWITCH_OFF) switchOff: boolean,
        formBuilder: FormBuilder,
    ) {
        this.dialogCtrl = ctrl;
        this.switchOffEnabled = Boolean(switchOff);
        this.formBuilder = formBuilder;
    }

    /**
     *
     *
     * @memberof MessageFooterComponent
     */
    public ngOnInit() {

        if (this.switchOffEnabled) {
            this.switchOffFormControl = this.formBuilder.control(false);
            this.switchOffFormControl.valueChanges
                .subscribe((checked: boolean) => {
                    this.dialogCtrl.showAgain = checked;
                });
        }
    }

    public onClose() {
        this.dialogCtrl.close();
    }
}
