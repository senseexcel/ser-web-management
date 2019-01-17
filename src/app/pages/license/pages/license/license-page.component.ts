import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { LicenseValidator, License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { finalize, takeUntil, tap, mergeMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { ValidationStep, ILicenseValidationResult } from '../../api/validation-result.interface';

@Component({
    selector: 'smc-license-page',
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

    /**
     * license model
     *
     * @type {LicenseModel}
     * @memberof LicensePageComponent
     */
    public licenseModel: LicenseModel;

    /**
     * flag installation is completed
     *
     * @type {boolean}
     * @memberof LicensePageComponent
     */
    public isInstallationInvalid: boolean;

    /**
     * map installation process
     *
     * @type {Map<ValidationStep, ILicenseValidationResult>}
     * @memberof LicensePageComponent
     */
    public installationProgress: Map<ValidationStep, ILicenseValidationResult>;

    /**
     * page properties which will be shown
     *
     * @type {any[]}
     * @memberof LicensePageComponent
     */
    public properties: any[] = [];

    /**
     * selected page part
     *
     * @type {*}
     * @memberof LicensePageComponent
     */
    public selectedProperty: any;

    /**
     * page part license overview
     *
     * @private
     * @type {ElementRef}
     * @memberof LicensePageComponent
     */
    @ViewChild('licenseOverview')
    private overviewContainer: ElementRef;

    /**
     * page part license information
     *
     * @private
     * @type {ElementRef}
     * @memberof LicensePageComponent
     */
    @ViewChild('licenseInfo')
    private infoContainer: ElementRef;

    /**
     * page part licensed users
     *
     * @private
     * @type {ElementRef}
     * @memberof LicensePageComponent
     */
    @ViewChild('licensedUsers')
    private userContainer: ElementRef;

    /**
     * subject witch submits true if component gets destroyed
     * to unsubscribe from observables
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof LicensePageComponent
     */
    private isDestroyed$: Subject<boolean>;

    /**
     * license service
     *
     * @private
     * @type {License}
     * @memberof LicensePageComponent
     */
    private license: License;

    /**
     * license validator service
     *
     * @private
     * @type {LicenseValidator}
     * @memberof LicensePageComponent
     */
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
            { label: 'License Information', part: 'information' },
            { label: 'License Overview' , part: 'overview'},
            { label: 'Licensed Users', part: 'users'}
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
     * scroll to part of page
     *
     * @param {*} selected
     * @param {string} part
     * @returns
     * @memberof LicensePageComponent
     */
    public showPagePart(selected, part: string) {

        let scrollToContainer: ElementRef;

        switch (part) {
            case 'overview':
                scrollToContainer = this.overviewContainer;
                break;
            case 'information':
                scrollToContainer = this.infoContainer;
                break;
            case 'users':
                scrollToContainer = this.userContainer;
                break;
            default:
                return;
        }

        scrollToContainer.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        this.selectedProperty = selected;
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
