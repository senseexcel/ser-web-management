import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenseValidator } from '@app/modules/ser-license/services';
import { ILicenseValidationResult } from '@app/modules/ser-license/api/validation-result.interface';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProcessService } from '../../services';

@Component({
    selector: 'app-monitoring-page',
    styleUrls: ['./monitoring-page.component.scss'],
    templateUrl: 'monitoring-page.component.html',
})

export class MonitoringPageComponent implements OnDestroy, OnInit {

    /**
     * data has been loaded, page is ready
     *
     * @type {boolean}
     * @memberof MonitoringPageComponent
     */
    public ready: boolean;

    public isLoading: boolean;

    /**
     * determine we have an error for license (not exists, no rights)
     *
     * @type {boolean}
     * @memberof MonitoringPageComponent
     */
    public hasError: boolean;

    /**
     * license validation service
     *
     * @private
     * @type {LicenseValidator}
     * @memberof MonitoringPageComponent
     */
    private licenseValidator: LicenseValidator;

    private processService: ProcessService;

    /**
     * will submit true if component gets destroyed to unsubscribe
     * from observables
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof MonitoringPageComponent
     */
    private isDestroyed$: Subject<boolean>;

    constructor(
        processService: ProcessService,
        validator: LicenseValidator
    ) {
        this.licenseValidator = validator;
        this.isDestroyed$ = new Subject();
        this.hasError = false;
        this.processService = processService;
        this.isLoading = false;
    }

    /**
     * on component get initialized
     *
     * @memberof MonitoringPageComponent
     */
    public ngOnInit() {
        this.isLoading = true;
        this.licenseValidator.validateLicenseExists()
            .pipe(
                finalize(() => this.ready = true),
                takeUntil(this.isDestroyed$)
            )
            .subscribe((result: ILicenseValidationResult) => {
                if (!result.isValid) {
                    this.hasError = true;
                }
            });
    }

    /**
     * on component gets destroyed
     *
     * @memberof MonitoringPageComponent
     */
    public ngOnDestroy() {
        this.isDestroyed$.next(true);
    }

    public doRefresh () {
        this.isLoading = true;
        this.processService.refreshProcessList()
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((data) => {
                this.isLoading = false;
            });
    }

    public stopProcess() {
        this.isLoading = true;
        this.processService.stopProcess(null)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(() => {
                this.isLoading = false;
            });
    }

    public stopAll() {
    }
}
