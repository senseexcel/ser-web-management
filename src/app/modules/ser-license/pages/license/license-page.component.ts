import { Component, OnInit } from '@angular/core';
import { ContentLibNotExistsException, InvalidQlikLicenseException } from '../../api/exceptions';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { forkJoin } from 'rxjs';
import { ContentLibService, LicenseService } from '../../services';

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
     * content library service to validate current installation is valid
     *
     * @private
     * @type {ContentLibService}
     * @memberof LicensePageComponent
     */
    private contentLib: ContentLibService;

    /**
     * license service
     *
     * @private
     * @type {LicenseService}
     * @memberof LicensePageComponent
     */
    private license: LicenseService;

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
        contentLib: ContentLibService,
        license: LicenseService,
        modal: ModalService
    ) {
        this.contentLib = contentLib;
        this.license = license;
        this.modal = modal;

        this.isInstallationInvalid = false;
    }

    /**
     *
     *
     * @memberof LicensePageComponent
     */
    ngOnInit() {

        forkJoin([
            this.contentLib.fetchContentLibrary(),
            this.license.fetchQlikSerialNumber()
        ])
        .subscribe(
            // done
            () => {
                this.isInstallationInvalid = false;
            },
            // on error
            (error) => {
                this.handleError(error);
                this.isInstallationInvalid = true;
            },
            // complete
            () => {
                this.isLoaded = true;
            }
        );
    }

    /**
     * handle errors
     *
     * @private
     * @param {*} error
     * @memberof LicensePageComponent
     */
    private handleError(error) {

        let message: string;
        let title: string;

        switch (error.constructor) {

            case ContentLibNotExistsException:
                title = 'No ContentLibrary found';
                message = 'ContentLibrary senseexcel could not found.';
                break;

            case InvalidQlikLicenseException:
                title = 'Error: Qlik License';
                message = 'Qlik License could not read or is invalid. Pleas contact your Administrator.';
                break;

            default:
                title = 'An Error occured !';
                message = 'An unexpected error occured, please contact your System Adminstrator for more Informations.';
                console.error(error.message);
        }

        this.modal.openMessageModal(title, message);
    }
}
