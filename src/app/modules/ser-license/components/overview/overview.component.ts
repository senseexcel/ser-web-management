import { Component, OnInit, OnDestroy } from '@angular/core';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { IModalData } from '@core/modules/modal/api/modal-config.interface';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { InsertOverlayComponent } from '../insert-overlay/insert-overlay.component';
import { InsertOverlayFooterComponent } from '../insert-overlay/insert-overlay-footer.component';
import { SerLicenseResponseException } from '../../api/exceptions';

@Component({
    selector: 'app-license-overview',
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

        const modalData: IModalData<InsertOverlayComponent> = {
            bodyComponent: InsertOverlayComponent,
            control: InsertOverlayControl,
            footerComponent: InsertOverlayFooterComponent,
            title: 'Insert License',
        };

        this.modal.open(modalData, { panelClass: ['license-modal--insert']});
    }

    public loadFromServer() {
        this.license.fetchLicense()
            .pipe(
                catchError((error: Error) => {
                    this.handleResponseError(error);
                    return of(null);
                })
            )
            .subscribe();
    }

    private handleResponseError(error: Error) {
        switch (error.constructor) {
            case SerLicenseResponseException:

                const responseError = <SerLicenseResponseException>error;
                const title = 'Error load License';
                const msg   = `License could not loaded with following Reason: ${responseError.response.error}\n
                For more Informations please contact your sense excel reporting consultant.
                `;

                this.modal.openMessageModal(title, msg);
            break;
            default:
                throw error;
        }
    }
}
