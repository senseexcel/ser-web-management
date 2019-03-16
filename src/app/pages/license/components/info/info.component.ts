import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ILicense } from '@smc/modules/license/api';
import { LicenseSource } from '../../services/license-source';

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

    public qlikLicense: string;

    public licenseKey = '';

    /**
     * current license status valid or invalid
     *
     * @type {string}
     * @memberof InfoComponent
     */
    public licenseStatus: 'valid' | 'invalid'  = 'invalid';

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

    constructor() {
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
        this.licenseSource.changed$.subscribe((license: ILicense) => {
            this.licenseKey    = license.licenseKey;
            this.licenseStatus = license.validate().isValid ? 'valid' : 'invalid';
        });
    }

    private validateLicense() {
    }
}
