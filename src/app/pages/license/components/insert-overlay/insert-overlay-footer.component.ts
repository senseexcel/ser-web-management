import { Component, Inject } from '@angular/core';
import { MODAL_OVERLAY_CTRL } from '@smc/modules/modal/api/modal-content.injector';
import { InsertOverlayControl } from '../../services/insert-overlay.control';

@Component({
    selector: 'smc-insert-overlay-footer',
    templateUrl: 'insert-overlay-footer.component.html'
})

export class InsertOverlayFooterComponent {

    private ctrl: InsertOverlayControl;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: InsertOverlayControl,
    ) {
        this.ctrl      = ctrl;
    }

    /**
     * apply license
     *
     * @memberof InsertOverlayFooterComponent
     */
    public apply() {
        this.close();
    }

    /**
     * close overlay
     *
     * @memberof InsertOverlayFooterComponent
     */
    public close() {
        this.ctrl.close();
    }
}
