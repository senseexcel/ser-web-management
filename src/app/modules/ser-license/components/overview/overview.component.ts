import { Component, OnInit, OnDestroy } from '@angular/core';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { IModalData } from '@core/modules/modal/api/modal-config.interface';
import { InsertOverlayControl } from '../../services/insert-overlay.control';
import { InsertOverlayComponent } from '../insert-overlay/insert-overlay.component';
import { InsertOverlayFooterComponent } from '../insert-overlay/insert-overlay-footer.component';

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
        this.license.fetchLicense().subscribe();
    }
}
