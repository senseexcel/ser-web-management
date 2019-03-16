import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LicenseSource } from '../services/license-source';
import { License } from '../services';
import { ILicense } from '@smc/modules/license/api';

@Component({
    selector: 'smc-license-page',
    styleUrls: ['./license.page.scss'],
    templateUrl: 'license.page.html'
})
export class LicensePageComponent implements OnDestroy, OnInit {

    public ready: boolean;
    public isInstallationInvalid: boolean;
    public properties: any[] = [];
    public selectedProperty: any;
    public licenseSource: LicenseSource = new LicenseSource();

    @ViewChild('licenseOverview')
    private overviewContainer: ElementRef;

    @ViewChild('licenseInfo')
    private infoContainer: ElementRef;

    @ViewChild('licensedUsers')
    private userContainer: ElementRef;

    private isDestroyed$: Subject<boolean>;

    /**
     * Creates an instance of LicensePageComponent.
     *
     * @param {ContentLibService} contentLib
     * @memberof LicensePageComponent
     */
    constructor(
        private repository: License,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.isDestroyed$ = new Subject();
    }

    /**
     * on initialize component first check sense excel reporting
     * has been installed correctly and then load current license data
     * or display error page
     *
     * @memberof LicensePageComponent
     */
    ngOnInit() {
        this.properties = [
            { key: 'information', label: 'SMC_LICENSE.INFORMATIONS.LABEL'},
            { key: 'overview',    label: 'SMC_LICENSE.OVERVIEW.LABEL'    },
            { key: 'users',       label: 'SMC_LICENSE.USERS.LABEL'       }
        ];
        this.loadPage();
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    public navigateBack() {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    /**
     * reload page
     *
     * @memberof LicensePageComponent
     */
    public reload() {
        this.isDestroyed$.next(true);
        this.loadPage();
    }

    /**
     * save license data and upload to server
     *
     * @memberof LicensePageComponent
     */
    public saveLicense() {
    }

    /**
     * scroll to part of page
     *
     * @param {*} selected
     * @param {string} part
     * @returns
     * @memberof LicensePageComponent
     */
    public showPagePart(selected, part: string) {

        let scrollToContainer: ElementRef;

        switch (part) {
            case 'overview':    scrollToContainer = this.overviewContainer; break;
            case 'information': scrollToContainer = this.infoContainer;     break;
            case 'users':       scrollToContainer = this.userContainer;     break;
            default:
                return;
        }

        scrollToContainer.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        this.selectedProperty = selected;
    }

    /**
     * load page
     *
     * @private
     * @memberof LicensePageComponent
     */
    private loadPage() {
        this.ready = false;

        this.repository.loadLicenseFile().subscribe((license: ILicense) => {
            this.licenseSource.license = license;
        });
    }
}
