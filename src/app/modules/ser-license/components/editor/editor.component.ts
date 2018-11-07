import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LicenseService } from '../../services';

@Component({
    selector: 'app-license-editor',
    templateUrl: 'editor.component.html'
})

export class EditorComponent implements OnInit {

    public content: string;

    @ViewChild('input')
    private input: ElementRef;

    private licenseService: LicenseService;

    constructor(
        licenseService: LicenseService
    ) {
        this.licenseService = licenseService;
    }

    ngOnInit() {
        /*
        this.licenseService.fetchSenseExcelReportingLicense()
            .subscribe(() => {});
        */
    }
}
