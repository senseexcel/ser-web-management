import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { LicenseValidator, License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { switchMap, finalize, catchError } from 'rxjs/operators';
import { LicenseInstallationInvalidException } from '../../api/exceptions/license-installation-invalid.exception';

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
    public ready: boolean;

    public licenseModel: LicenseModel;

    public isInstallationInvalid: boolean;

    public errors: string[];

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
    ) {
        this.licenseValidator = licenseValidator;
        this.isInstallationInvalid = false;
        this.license = license;
    }

    /**
     *
     *
     * @memberof LicensePageComponent
     */
    ngOnInit() {

        this.ready = false;

        this.licenseValidator.isValidateLicenseInstallation()
            .pipe(
                switchMap(() => this.license.loadLicense()),
                finalize(() => this.ready = true)
            )
            .subscribe(
                /** installation is valid and license has been loaded */
                (license: LicenseModel) => this.licenseModel = license,
                /** installation not valid or error occured*/
                (error) => {
                    this.isInstallationInvalid = true;
                    if (error instanceof LicenseInstallationInvalidException) {
                        this.errors = error.errors;
                    } else {
                        console.error(error);
                    }
                }
            );
    }
}
