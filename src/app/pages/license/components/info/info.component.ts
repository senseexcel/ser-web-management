import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { LicenseSource } from '../../model/license-source';
import { ILicense, LicenseType } from '@smc/modules/license/api';
import {
    toManyUsersAtSameDateError,
    licenseExpiredError,
    licenseNotActiveYetError,
    noLimitError
} from '@smc/modules/license';
import { TokenLicense } from '@smc/modules/license/model';

@Component({
    selector: 'smc-license-info',
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

    public qlikSerial: string;

    public licenseKey = '';

    /**
     * current license status valid or invalid
     *
     * @type {string}
     * @memberof InfoComponent
     */
    public licenseStatus: 'valid' | 'invalid' = 'invalid';

    public validationErrors: string[];

    public validationWarnings: string[];

    @Input()
    public licenseSource: LicenseSource;

    /**
     * emmits true if components get destroyed to unsubscribe automatically
     * from all observables
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof InfoComponent
     */
    private isDestroyed$: Subject<boolean>;

    constructor() {
        this.isDestroyed$ = new Subject();
        this.validationErrors   = [];
        this.validationWarnings = [];
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

        this.licenseSource.changed$
            .subscribe((license) => this.sourceChanged(license));

        this.licenseSource.validate$
            .subscribe();
    }

    private sourceChanged(license: ILicense) {

        this.validationErrors   = [];
        this.validationWarnings = [];

        this.licenseKey = license.licenseKey;
        this.qlikSerial = this.licenseSource.qlikLicense.serial;

        this.isValid = this.licenseSource.isValid;

        if (this.licenseKey !== this.qlikSerial) {
            this.isValid = false;
            this.validationErrors.push('MISSMATCH_SERIALS');
        }

        this.handleLicenseValidations();
    }

    /**
     * check for validation errors
     */
    private handleLicenseValidations() {

        this.resolveErrorsLicense();

        switch (this.licenseSource.license.licenseType) {
            case LicenseType.NAMED:
                this.resolveErrorsNamedLicense();
                break;
            case LicenseType.TOKEN:
                this.resolveErrorsTokenLicense();
                break;
            default:
                this.validationWarnings.push('UNKNOWN_LICENSE');
        }
    }

    /**
     * resolve general erros for license
     */
    private resolveErrorsLicense() {
        const errors = this.licenseSource.validationResult.errors;

        if (errors.has(licenseExpiredError)) {
            this.validationErrors.push('LICENSE_EXPIRED');
        }

        if (errors.has(licenseNotActiveYetError)) {
            this.validationErrors.push('LICENSE_NOT_ACTIVATED');
        }
    }

    /**
     * resolve errors for token license
     */
    private resolveErrorsTokenLicense() {

        const license = this.licenseSource.license as TokenLicense;
        const errors = this.licenseSource.validationResult.errors;

        if (errors.has(noLimitError)) {
            this.validationErrors.push('LICENSE_NO_LIMIT');
        }

        if (license.tokens < this.licenseSource.qlikLicense.tokens) {
            this.isValid = false;
            this.validationErrors.push('NOT_ENOUGH_SER_TOKENS');
        }
    }

    /**
     * resolve errors for named license
     */
    private resolveErrorsNamedLicense() {
        const errors = this.licenseSource.validationResult.errors;

        if (errors.has(noLimitError)) {
            this.validationErrors.push('LICENSE_NO_LIMIT');
        }

        if (errors.has(toManyUsersAtSameDateError)) {
            this.validationErrors.push('TO_MANY_USERS_AT_SAME_DATE');
        }
    }
}
