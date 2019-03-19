import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { catchError, takeUntil, map } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { ModalService } from '@smc/modules/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nTranslation } from '@smc/modules/smc-common';
import { LicenseFactory, ILicense } from '@smc/modules/license';

import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { InsertOverlayComponent } from '../insert-overlay/insert-overlay.component';
import { InsertOverlayFooterComponent } from '../insert-overlay/insert-overlay-footer.component';
import { SerLicenseResponseException } from '../../api/exceptions';
import { ILicenseModalData } from '../../api/license-modal.data';
import { LicenseRepository } from '../../services';
import { LicenseSource } from '../../model/license-source';

@Component({
    selector: 'smc-license-overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.scss']
})

export class OverviewComponent implements OnDestroy, OnInit {

    public content: string;
    public isReady = false;
    public licenseData = '';

    private isDestroyed$: Subject<boolean>;

    @Input()
    public licenseSource: LicenseSource;

    constructor(
        private licenseFactory: LicenseFactory,
        private license: LicenseRepository,
        private modal: ModalService
    ) {
        this.isDestroyed$ = new Subject();
    }

    /**
     * component get destroyed
     *
     * @memberof LicenseComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    /**
     * component get initialized
     *
     * @memberof LicenseComponent
     */
    ngOnInit() {
        this.licenseSource.changed$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((license: ILicense) => {
                this.licenseData = license.licenseData.join('\n');
            });
    }

    /**
     * insert license
     *
     * @memberof OverviewComponent
     */
    public insertLicense() {
        this.openModal('SMC_LICENSE.OVERVIEW.ACTIONS.INSERT');
    }

    /**
     * Edit License
     *
     * @memberof OverviewComponent
     */
    public editLicense() {
        this.openModal('SMC_LICENSE.OVERVIEW.ACTIONS.EDIT');
    }

    /**
     * fetch license from remote server
     */
    public loadFromServer() {
        this.license.fetchSenseExcelReportingLicense().pipe(
            map((raw) => this.licenseFactory.createFromRaw(raw[0])),
            catchError((error: Error) => {
                this.handleResponseError(error);
                return of(null);
            }))
            .subscribe((license: ILicense) => {
                if (license) {
                    this.licenseSource.license = license;
                }
            });
    }

    private openModal(title: string) {
        const modalData: ILicenseModalData<InsertOverlayComponent> = {
            bodyComponent: InsertOverlayComponent,
            control: InsertOverlayControl,
            footerComponent: InsertOverlayFooterComponent,
            title,
            license: this.licenseSource.license
        };

        const ctrl = this.modal.open(modalData, { panelClass: ['license-modal--insert'] }) as InsertOverlayControl;
        ctrl.update$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((licenseRaw: string) => {
                const license = this.licenseFactory.createFromRaw(licenseRaw);
                this.licenseSource.license = license;
            });
    }

    private handleResponseError(error: Error) {
        switch (error.constructor) {
            case SerLicenseResponseException:

                const responseError = <SerLicenseResponseException>error;
                const title = 'SMC_LICENSE.OVERVIEW.MODAL.ERROR_RESPONSE_TITLE';
                const msg: I18nTranslation = {
                    key: 'SMC_LICENSE.OVERVIEW.MODAL.ERROR_RESPONSE_MESSAGE',
                    param: { ERROR: responseError.response.error }
                };

                this.modal.openMessageModal(title, msg);
                break;
            default:
                throw error;
        }
    }
}
