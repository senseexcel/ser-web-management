import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'smc-license-error-page',
    styleUrls: ['license-error.page.scss'],
    templateUrl: 'license-error.page.html'
})
export class LicenseErrorPageComponent {

    public constructor(
        private router: Router
    ) {}

    public reload() {
        this.router.navigate(['./license']);
    }
}
