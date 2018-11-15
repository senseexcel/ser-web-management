import { Component, OnInit, OnDestroy } from '@angular/core';
import { License, LicenseValidator, LicenseRepository } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { mergeMap, takeUntil, map } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';

@Component({
    selector: 'app-license-info',
    styleUrls: ['info.component.scss'],
    templateUrl: 'info.component.html'
})

export class InfoComponent implements OnDestroy, OnInit {

    /**
     * flag license has been validated
     *
     * @type {boolean}
     * @memberof InfoComponent
     */
    public isValid: boolean;

    /**
     * current loaded license
     *
     * @type {LicenseModel}
     * @memberof InfoComponent
     */
    public licenseModel: LicenseModel;

    public qlikLicense: string;

    /**
     * current license status valid or invalid
     *
     * @type {string}
     * @memberof InfoComponent
     */
    public licenseStatus: 'valid' | 'invalid';

    public ready = false;

    /**
     * license service
     *
     * @private
     * @type {License}
     * @memberof InfoComponent
     */
    private license: License;

    /**
     * license repository
     *
     * @private
     * @type {LicenseRepository}
     * @memberof InfoComponent
     */
    private repository: LicenseRepository;

    /**
     * license validator service
     *
     * @private
     * @type {LicenseValidator}
     * @memberof InfoComponent
     */
    private validator: LicenseValidator;

    /**
     * emmits true if components get destroyed to unsubscribe automatically
     * from all observables
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof InfoComponent
     */
    private isDestroyed$: Subject<boolean>;

    constructor(
        license: License,
        repository: LicenseRepository,
        validator: LicenseValidator
    ) {
        this.isDestroyed$ = new Subject();
        this.license      = license;
        this.repository   = repository;
        this.validator    = validator;
    }

    /**
     * if component get destroyed
     *
     * @memberof InfoComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    /**
     * on component gets initialized
     *
     * @memberof InfoComponent
     */
    ngOnInit() {
        this.initLicense();
    }

    /**
     * init license data to determine status,
     * this could also happens on update
     *
     * @private
     * @memberof InfoComponent
     */
    private initLicense() {

       this.license.onload$.pipe(
            mergeMap((license: LicenseModel) => {
                return forkJoin([
                    this.validator.validateLicenseKey(license.key),
                    this.repository.fetchQlikSerialNumber()
                ]).pipe(
                        map(([validationResult, serial]) => {
                            return {
                                license,
                                qlikSerial: serial,
                                valid: validationResult.isValid
                            };
                        }),
                    );
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe((result) => {
            this.isValid       = result.valid;
            this.licenseModel  = result.license;
            this.licenseStatus = this.isValid ? 'valid' : 'invalid';
            this.qlikLicense   = result.qlikSerial;
            this.ready         = true;
        });
    }
}
