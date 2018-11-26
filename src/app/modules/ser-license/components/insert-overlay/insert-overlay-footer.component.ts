import { Component, Inject } from '@angular/core';
import { MODAL_OVERLAY_CTRL } from '@core/modules/modal/api/modal-content.injector';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { License, LicenseValidator, LicenseReader } from '../../services';

@Component({
    selector: 'app-insert-overlay-footer',
    templateUrl: 'insert-overlay-footer.component.html'
})

export class InsertOverlayFooterComponent {

    private ctrl: InsertOverlayControl;

    private license: License;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: InsertOverlayControl,
        license: License,
        reader: LicenseReader,
        validator: LicenseValidator
    ) {
        this.ctrl      = ctrl;
        this.license   = license;
    }

    /**
     * apply license
     *
     * @memberof InsertOverlayFooterComponent
     */
    public apply() {
        this.license.updateLicense(this.ctrl.content);
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
