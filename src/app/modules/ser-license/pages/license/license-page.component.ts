import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenseValidator, License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { switchMap, finalize, catchError, takeUntil, tap } from 'rxjs/operators';
import { LicenseInstallationInvalidException } from '../../api/exceptions/license-installation-invalid.exception';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-license',
    styleUrls: ['./license-page.component.scss'],
    templateUrl: 'license-page.component.html'
})

export class LicensePageComponent implements OnDestroy, OnInit {

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

    private isDestroyed$: Subject<boolean>;

    private license: License;

    private licenseValidator: LicenseValidator;

    /**
     * Creates an instance of LicensePageComponent.
     *
     * @param {ContentLibService} contentLib
     * @memberof LicensePageComponent
     */
    constructor(
        license: License,
        licenseValidator: LicenseValidator,
    ) {
        this.licenseValidator = licenseValidator;
        this.isInstallationInvalid = false;
        this.license = license;

        this.isDestroyed$ = new Subject();
    }

    /**
     * on initialize component first check sense excel reporting
     * has been installed correctly and then load current license data
     * or display error page
     *
     * @memberof LicensePageComponent
     */
    ngOnInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    /**
     * reload page
     *
     * @memberof LicensePageComponent
     */
    public reload() {
        this.isDestroyed$.next(true);
        this.loadPage();
    }

    /**
     * save license data and upload to server
     *
     * @memberof LicensePageComponent
     */
    public saveLicense() {
        this.license.saveLicense()
            .subscribe();
    }

    /**
     * load page
     *
     * @private
     * @memberof LicensePageComponent
     */
    private loadPage() {
        this.ready = false;
        this.licenseValidator.isValidateLicenseInstallation()
            .pipe(
                tap(() => this.isInstallationInvalid = false),
                switchMap(() => this.license.loadLicense()),
                finalize(() => this.ready = true),
                takeUntil(this.isDestroyed$)
            )
            .subscribe(
                /** installation is valid and license has been loaded */
                (license: LicenseModel) => {
                    this.licenseModel = license;
                },
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
