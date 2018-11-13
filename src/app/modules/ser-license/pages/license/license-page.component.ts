import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenseValidator, License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { finalize, takeUntil, tap, mergeMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { ValidationStep, ILicenseValidationResult } from '../../api/validation-result.interface';

@Component({
    selector: 'app-license-page',
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

    public installationProgress: Map<ValidationStep, ILicenseValidationResult>;

    public properties: any[] = [];

    public selectedProperty: any;

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

        this.properties = [
            { label: 'License Information' },
            { label: 'License Overview' },
            { label: 'Licensed Users' }
        ];

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
        this.licenseValidator.isValidLicenseInstallation()
            .pipe(
                tap((result) => {
                    this.isInstallationInvalid = !result.isValid;
                    this.installationProgress  = result.data;
                }),
                mergeMap((result) => {
                    if (!result.isValid) {
                        this.properties = [{label: 'Installation'}];
                        return of(null);
                    }
                    return this.license.loadLicense();
                }),
                finalize(() => this.ready = true),
                takeUntil(this.isDestroyed$)
            )
            .subscribe((license: LicenseModel) => {
                this.licenseModel = license;
                this.selectedProperty = this.properties[0] || '';
            });
    }
}
