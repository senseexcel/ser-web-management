import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { License } from '../../services';

@Component({
    selector: 'app-license-editor',
    templateUrl: 'editor.component.html'
})

export class EditorComponent implements OnInit {

    public content: string;

    @ViewChild('input')
    private input: ElementRef;

    private license: License;

    constructor(
        license: License
    ) {
        this.license = license;
    }

    ngOnInit() {
        /*
        this.licenseService.fetchSenseExcelReportingLicense()
            .subscribe(() => {});
        */
    }
}
