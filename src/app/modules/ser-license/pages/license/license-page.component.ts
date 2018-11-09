import { Component, OnInit } from '@angular/core';
import {
    ContentLibNotExistsException,
    QlikLicenseNoAccessException,
    QlikLicenseInvalidException
} from '../../api/exceptions';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { License, LicenseValidator } from '../../services';
import { ILicenseValidationResult } from '../../api/validation-result.interface';

@Component({
    selector: 'app-license',
    styleUrls: ['./license-page.component.scss'],
    templateUrl: 'license-page.component.html'
})

export class LicensePageComponent implements OnInit {

    /**
     *
     *
     * @type {boolean}
     * @memberof LicensePageComponent
     */
    public isLoaded: boolean;

    public isInstallationInvalid: boolean;

    /**
     * license service
     *
     * @private
     * @type {LicenseService}
     * @memberof LicensePageComponent
     */
    private license: License;

    private licenseValidator: LicenseValidator;

    /**
     * modal service to display messages in dialog
     *
     * @private
     * @type {ModalService}
     * @memberof LicensePageComponent
     */
    private modal: ModalService;

    /**
     * Creates an instance of LicensePageComponent.
     *
     * @param {ContentLibService} contentLib
     * @param {ModalService} modal
     * @memberof LicensePageComponent
     */
    constructor(
        license: License,
        licenseValidator: LicenseValidator,
        modal: ModalService
    ) {
        this.license = license;
        this.licenseValidator = licenseValidator;
        this.modal = modal;

        this.isInstallationInvalid = false;
    }

    /**
     *
     *
     * @memberof LicensePageComponent
     */
    ngOnInit() {

        this.licenseValidator.validateLicenseInstallation()
            .subscribe((validationResult: ILicenseValidationResult) => {

                if (!validationResult.isValid) {
                    this.showInvalidInstallationMessage(validationResult);
                }
            });
    }

    /**
     * displays modal message if installation is not valid
     *
     * @private
     * @param {ILicenseValidationResult} validation
     * @memberof LicensePageComponent
     */
    private showInvalidInstallationMessage(validation: ILicenseValidationResult) {
        const title   = 'Invalid Instaalation';
        const message = validation.errors.join('\n');

        this.modal.openMessageModal(title, message);
    }
}
