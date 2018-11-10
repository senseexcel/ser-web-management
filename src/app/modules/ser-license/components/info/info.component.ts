import { Component, OnInit } from '@angular/core';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';

@Component({
    selector: 'app-license-info',
    templateUrl: 'info.component.html'
})

export class InfoComponent implements OnInit {

    private license: License;

    constructor(
        license: License
    ) {
        this.license = license;
    }

    ngOnInit() {
        this.license.license$.subscribe((license: LicenseModel) => {
        });
    }
}
