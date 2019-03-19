import { Injectable, Inject } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { LicenseRepository } from '../services';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { ContentlibController } from '@smc/modules/contentlib/services/contentlib.controller';

/**
 * we could only visit license manager
 * if prerequirements are solved
 */
@Injectable({ providedIn: 'root' })
export class LicensePreinstallGuard implements CanActivate {

    private lib = 'senseexcel';
    private file = 'license.txt';

    constructor(
        private clibCtrl: ContentlibController,
        private licenseService: LicenseRepository,
        private router: Router
    ) {
    }

    /**
     * prevalidate all requirements are full filled
     */
    canActivate(): Observable<UrlTree | boolean> {
        const validation$ = [this.validateQlikLicense(), this.validateLicense()];
        return forkJoin(validation$).pipe(
            map(([licenseResult, installResult]) => {
                const isValid = licenseResult && installResult;

                if (!isValid) {
                    return this.router.parseUrl('/license/error');
                }
                return isValid;
            })
        );
    }

    /**
     * validate content library exists
     *
     * @returns {Observable<LicenseValidationResult>}
     * @memberof LicenseValidator
     */
    private validateLicense(): Observable<boolean> {
        const library$ = this.clibCtrl.open(this.lib);
        return library$.pipe(
            mergeMap((lib) => lib.fileExists(this.file).pipe(
                switchMap((file) => file ? of(true) : lib.createFile(this.file, 'hallo hallo')))
            ),
            map(() => true), // if no error happened
            catchError((error) => of(false))
        );
    }

    /**
     * validate we could load qlik license file
     *
     * @returns {Observable<LicenseValidationResult>}
     * @memberof LicenseValidator
     */
    private validateQlikLicense(): Observable<boolean> {
        return this.licenseService.fetchQlikLicenseFile().pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
