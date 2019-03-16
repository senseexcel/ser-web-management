import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LicenseRepository } from '../../services';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { ModalService, IModalData } from '@smc/modules/modal';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { InsertOverlayComponent } from '../insert-overlay/insert-overlay.component';
import { InsertOverlayFooterComponent } from '../insert-overlay/insert-overlay-footer.component';
import { SerLicenseResponseException } from '../../api/exceptions';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nTranslation } from '@smc/modules/smc-common';
import { LicenseSource } from '../../model/license-source';
import { ILicense } from '@smc/modules/license/api';

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

    public loadFromServer() {
        this.license.readLicenseFile()
            .pipe(
                catchError((error: Error) => {
                    this.handleResponseError(error);
                    return of(null);
                })
            )
            .subscribe(
                () => {},
                /**
                 * for any reason, if no internet connection is available (status: 0) this error will not catched
                 * with catchError operator from rxjs.
                 *
                 * we need to handle this here
                 */
                (error) => {
                    if (error.constructor === HttpErrorResponse && error.status === 0) {
                        const title = 'SMC_LICENSE.OVERVIEW.MODAL.ERROR_CONNECTION_TITLE';
                        const msg: I18nTranslation = {
                            key: 'SMC_LICENSE.OVERVIEW.MODAL.ERROR_CONNECTION_MESSAGE',
                        };
                        this.modal.openMessageModal(title, msg);
                    }
                }
            );
    }

    private openModal(title: string) {
        const modalData: IModalData<InsertOverlayComponent> = {
            bodyComponent: InsertOverlayComponent,
            control: InsertOverlayControl,
            footerComponent: InsertOverlayFooterComponent,
            title,
        };
        this.modal.open(modalData, { panelClass: ['license-modal--insert'] });
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
