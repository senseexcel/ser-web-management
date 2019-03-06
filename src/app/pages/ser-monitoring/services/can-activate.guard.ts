import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, merge, of, forkJoin } from 'rxjs';
import { LicenseValidator } from '@smc/pages/license/services';
import { reduce, map } from 'rxjs/operators';

@Injectable()
export class MonitoringCanActivate implements CanActivate {

    constructor(
        private licenseValidator: LicenseValidator
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return forkJoin(
            this.licenseValidator.validateQlikLicense(),
            this.licenseValidator.validateLicenseExists()
        ).pipe(
            map(([qlikLicense, serLicense]) => qlikLicense.isValid && serLicense.isValid)
        );
    }
}
