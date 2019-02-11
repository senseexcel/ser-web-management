import { Component, OnInit, OnDestroy } from '@angular/core';
import { License, LicenseValidator, LicenseRepository } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { mergeMap, takeUntil, map, switchMap, tap } from 'rxjs/operators';
import { Subject, forkJoin, of } from 'rxjs';
import { ILicenseValidationResult } from '../../api/validation-result.interface';

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

    public validationErrors: string[];

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
        this.validationErrors = [];
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

        this.license.update$
            .pipe(
                switchMap((license: LicenseModel) => this.validator.validateLicense(license)),
                takeUntil(this.isDestroyed$)
            )
            .subscribe((validationResult: ILicenseValidationResult) => {
                this.isValid          = validationResult.isValid;
                this.licenseStatus    = this.isValid ? 'valid' : 'invalid';
                this.validationErrors = validationResult.errors;
            });
    }

    /**
     * init license data to determine status,
     * this could also happens on update
     *
     * @private
     * @memberof InfoComponent
     */
    private initLicense() {

        const qlikSerial$ = this.repository.qlikSerial
            ? of(this.repository.qlikSerial)
            : this.repository.fetchQlikSerialNumber();

       this.license.onload$.pipe(
            switchMap((license: LicenseModel) => {
                this.licenseModel = license;
                return qlikSerial$;
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe((qlikSerial: string) => {
            this.licenseStatus    = this.licenseModel.validationResult.isValid ? 'valid' : 'invalid';
            this.validationErrors = this.licenseModel.validationResult.errors;
            this.qlikLicense      = qlikSerial;
            this.ready            = true;
        });
    }
}
