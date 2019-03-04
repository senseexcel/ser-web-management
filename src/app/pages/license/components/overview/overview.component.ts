import { Component, OnInit, OnDestroy } from '@angular/core';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { ModalService, IModalData } from '@smc/modules/modal';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { InsertOverlayComponent } from '../insert-overlay/insert-overlay.component';
import { InsertOverlayFooterComponent } from '../insert-overlay/insert-overlay-footer.component';
import { SerLicenseResponseException } from '../../api/exceptions';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nTranslation } from '@smc/modules/smc-common';

@Component({
    selector: 'smc-license-overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.scss']
})

export class OverviewComponent implements OnDestroy, OnInit {

    public content: string;
    public isReady = false;
    public licenseData: string;

    private isDestroyed$: Subject<boolean>;
    private license: License;
    private modal: ModalService;

    constructor(
        license: License,
        modal: ModalService
    ) {
        this.isDestroyed$ = new Subject();
        this.license = license;
        this.modal = modal;
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
        this.license.onload$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((license: LicenseModel) => {
                this.licenseData = license.text;
                this.isReady = true;
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
        this.license.fetchLicense()
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
        this.modal.open(modalData, { panelClass: ['license-modal--insert']});
    }

    private handleResponseError(error: Error) {
        switch (error.constructor) {
            case SerLicenseResponseException:

                const responseError = <SerLicenseResponseException>error;
                const title = 'SMC_LICENSE.OVERVIEW.MODAL.ERROR_RESPONSE_TITLE';
                const msg: I18nTranslation = {
                    key: 'SMC_LICENSE.OVERVIEW.MODAL.ERROR_RESPONSE_MESSAGE',
                    param: {ERROR: responseError.response.error}
                };

                this.modal.openMessageModal(title, msg);
            break;
            default:
                throw error;
        }
    }
}
