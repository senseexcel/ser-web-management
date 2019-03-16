import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { LicenseSource } from '../../model/license-source';
import { LicenseRepository } from '../../services';
import { ILicense } from '@smc/modules/license/api';

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

    constructor(
        private licenseRepository: LicenseRepository
    ) {
        this.isDestroyed$ = new Subject();
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

        this.licenseSource.changed$
            .subscribe((license) => this.sourceChanged(license));

        this.licenseSource.validate$
            .subscribe();
    }

    private sourceChanged(license: ILicense) {
        this.licenseKey = license.licenseKey;
        this.qlikSerial = this.licenseSource.qlikLicenseKey;

        this.isValid = this.licenseKey === this.qlikSerial;
        this.isValid = this.isValid && this.licenseSource.isValid;
    }
}
