import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, concat, from } from 'rxjs';
import { ContentLibService } from './contentlib.service';
import { LicenseRepository } from './license-repository';
import { map, catchError, concatAll, tap, switchMap, mergeMap, concatMap, reduce } from 'rxjs/operators';
import { ContentLibNotExistsException, QlikLicenseNoAccessException, QlikLicenseInvalidException } from '../api/exceptions';
import { ILicenseValidationResult } from '../api/validation-result.interface';

@Injectable()
export class LicenseValidator {

    private contentlib: ContentLibService;

    private licenseRepository: LicenseRepository;

    public constructor(
        contentlib: ContentLibService,
        licenseRepository: LicenseRepository
    ) {
        this.contentlib = contentlib;
        this.licenseRepository = licenseRepository;
    }

    /**
     * should return more specific errors
     *
     * @returns {Observable<boolean>}
     * @memberof Validator
     */
    public validateLicenseInstallation(): Observable<ILicenseValidationResult> {

        return forkJoin([
            this.validateContentLibrary(),
            this.validateQlikLicense()
        ]).pipe(
            map((res: ILicenseValidationResult[]) => {
                return res.reduce((result, current) => {
                    if (!result) {
                        return current;
                    }

                    result.isValid = result.isValid && current.isValid;
                    result.errors  = result.errors.concat(current.errors);
                    return result;
                });
            })
        );
    }

    /**
     *
     *
     * @returns {Observable<LicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public validateContentLibrary(): Observable<ILicenseValidationResult> {

        return of({isValid: true, errors: []}).pipe(
            mergeMap((result) => this.contentlib.fetchContentLibrary()
                .pipe(
                    map(() => result),
                    catchError((error: Error) => {
                        result.isValid = false;
                        switch (error.constructor) {
                            case ContentLibNotExistsException:
                                result.errors = ['Content library senseexcel does not exists.'];
                                break;
                            default:
                                throw error;
                        }
                        return of(result);
                    })
                )
            )
        );
    }

    /**
     *
     *
     * @returns {Observable<LicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public validateQlikLicense(): Observable<ILicenseValidationResult> {

        return of({isValid: true, errors: []}).pipe(
            mergeMap((result) => this.licenseRepository.fetchQlikSerialNumber()
                .pipe(
                    /** just return validation result will, skipped if fetchQlikSerialNumber throws an error */
                    map(() => result),
                    catchError((error: Error) => {
                        result.isValid = false;
                        switch (error.constructor) {
                            case QlikLicenseInvalidException:
                                result.errors = ['Qlik License is Invalid'];
                                break;
                            case QlikLicenseNoAccessException:
                                result.errors = ['Qlik License: no access'];
                                break;
                            default:
                                throw error;
                        }
                        return of(result);
                    }),
                )
            )
        );
    }
}
