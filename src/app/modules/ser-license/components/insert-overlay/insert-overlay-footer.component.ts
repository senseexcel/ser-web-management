import { Component, Inject } from '@angular/core';
import { MODAL_OVERLAY_CTRL } from '@core/modules/modal/api/modal-content.injector';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { License, LicenseValidator, LicenseReader } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { ILicenseValidationResult } from '../../api/validation-result.interface';

@Component({
    selector: 'app-insert-overlay-footer',
    templateUrl: 'insert-overlay-footer.component.html'
})

export class InsertOverlayFooterComponent {

    private ctrl: InsertOverlayControl;

    private license: License;

    private validator: LicenseValidator;

    private reader: LicenseReader;

    constructor(
        @Inject(MODAL_OVERLAY_CTRL) ctrl: InsertOverlayControl,
        license: License,
        reader: LicenseReader,
        validator: LicenseValidator
    ) {
        this.ctrl      = ctrl;
        this.license   = license;
        this.reader    = reader;
        this.validator = validator;
    }

    /**
     * apply license
     *
     * @memberof InsertOverlayFooterComponent
     */
    public apply() {

        /**
         * uncomment so we can only apply this input
         * after license has been validated
        const license: LicenseModel = this.reader.read(this.ctrl.content.replace(/\n/g, ' '));
        this.validator.validateLicense(license)
            .subscribe((result: ILicenseValidationResult) => {
                if (result.isValid) {
                    this.license.updateLicense(license);
                    this.close();
                }
            });
        */

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

    /**
     * fetch serial from server
     *
     * @memberof InsertOverlayFooterComponent
     */
    public fetch() {
        this.license.fetchLicense().subscribe((content) => {
            this.ctrl.update(content.raw);
            this.close();
        });
    }
}
