import { Component, OnInit } from '@angular/core';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';

@Component({
    selector: 'app-license-user',
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {

    public tableHeaderFields = [
        'id',
        'from',
        'to'
    ];

    public model: LicenseModel;

    public ready = false;

    private license: License;

    constructor(
        license: License
    ) {
        this.license = license;
    }

    ngOnInit() {
        this.license.onload$
            .subscribe((model: LicenseModel) => {
                this.model = model;
                this.ready = true;
            });
    }
}
