import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
// import { LicenseValidator } from '@smc/pages/license/services';

@Injectable()
export class MonitoringCanActivate implements CanActivate {

    constructor(
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return of(true);
        /*
        return forkJoin(
            this.licenseValidator.validateQlikLicense(),
            this.licenseValidator.validateLicenseExists()
        ).pipe(
            map(([qlikLicense, serLicense]) => qlikLicense.isValid && serLicense.isValid)
        );
        */
    }
}
