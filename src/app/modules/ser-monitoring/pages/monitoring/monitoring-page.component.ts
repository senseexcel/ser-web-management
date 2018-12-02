import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenseValidator } from '@app/modules/ser-license/services';
import { ILicenseValidationResult } from '@app/modules/ser-license/api/validation-result.interface';
import { finalize, takeUntil, catchError, tap, switchMap, mergeMap, mapTo, map, concatMap } from 'rxjs/operators';
import { Subject, concat, of, interval, pipe, merge, empty } from 'rxjs';
import { ProcessService } from '../../services';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-monitoring-page',
    styleUrls: ['./monitoring-page.component.scss'],
    templateUrl: 'monitoring-page.component.html',
})

export class MonitoringPageComponent implements OnDestroy, OnInit {

    /**
     * form control field to dis/enable autorefesh
     *
     * @type {FormControl}
     * @memberof MonitoringPageComponent
     */
    public autoRefreshControl: FormControl;

    /**
     * data has been loaded, page is ready
     *
     * @type {boolean}
     * @memberof MonitoringPageComponent
     */
    public ready: boolean;

    /**
     * flag we load some data or have finished
     *
     * @type {boolean}
     * @memberof MonitoringPageComponent
     */
    public isLoading: boolean;

    /**
     * if errors occure save them here
     *
     * @type {string[]}
     * @memberof MonitoringPageComponent
     */
    public errors: string[];

    /**
     * determine we have an error for license (not exists, no rights)
     *
     * @type {boolean}
     * @memberof MonitoringPageComponent
     */
    public hasError: boolean;

    /**
     * form builder service to create checkbox field
     * autocomplete
     *
     * @private
     * @type {FormBuilder}
     * @memberof MonitoringPageComponent
     */
    private formBuilder: FormBuilder;

    /**
     * license validation service
     *
     * @private
     * @type {LicenseValidator}
     * @memberof MonitoringPageComponent
     */
    private licenseValidator: LicenseValidator;

    /**
     * process service
     *
     * @private
     * @type {ProcessService}
     * @memberof MonitoringPageComponent
     */
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
        validator: LicenseValidator,
        formBuilder: FormBuilder
    ) {
        this.licenseValidator = validator;
        this.formBuilder = formBuilder;
        this.processService = processService;

        this.isDestroyed$ = new Subject();
        this.hasError = false;
        this.isLoading = false;
        this.errors = [];
    }

    /**
     * initialize monitoring page component
     *
     * validate first for qlik license
     * validate for user allocations, needed to create web socket connections
     * validate an license exists (not for a valid ser license)
     *
     * @memberof MonitoringPageComponent
     */
    public ngOnInit() {
        this.isLoading = true;

        concat(
            this.licenseValidator.validateQlikLicense(),
            this.processService.validateIsAllocated(),
            this.licenseValidator.validateLicenseExists()
        ).pipe(
            finalize(() => {
                this.autoRefreshControl = this.createAutoRefreshControl();

                this.ready = true;
                this.isLoading = false;
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe(
            (result: ILicenseValidationResult) => {
                if (!result.isValid) {
                    this.hasError = true;
                    this.errors = [...this.errors, ...result.errors];
                }
            }
        );
    }

    /**
     * on component gets destroyed
     *
     * @memberof MonitoringPageComponent
     */
    public ngOnDestroy() {
        this.isDestroyed$.next(true);
    }

    /**
     * handle footer action command to reload list
     *
     * @memberof MonitoringPageComponent
     */
    public doRefresh () {
        this.isLoading = true;
        this.processService.refreshProcessList()
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(() => {
                this.isLoading = false;
            });
    }

    /**
     * handle footer command stop all processes
     *
     * @memberof MonitoringPageComponent
     */
    public stopAll() {
        /** @todo implement */
    }

    /**
     *
     *
     * @private
     * @returns {FormControl}
     * @memberof MonitoringPageComponent
     */
    private createAutoRefreshControl(): FormControl {

        const control   = this.formBuilder.control('');
        const interval$ = interval(1000).pipe(
            concatMap(() => this.processService.refreshProcessList())
        );

        control.valueChanges.pipe(
            switchMap((val) => {
                return val ? interval$ : empty();
            }),
            takeUntil(this.isDestroyed$),
        ).subscribe();

        return control;
    }

    private refreshListByTimeout() {
    }
}
