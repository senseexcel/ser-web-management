import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { ContentLibService } from './contentlib.service';
import { LicenseRepository } from './license-repository';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { ContentLibNotExistsException, QlikLicenseNoAccessException, QlikLicenseInvalidException } from '../api/exceptions';
import { ILicenseValidationResult } from '../api/validation-result.interface';
import { LicenseInstallationInvalidException } from '../api/exceptions/license-installation-invalid.exception';

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
     * validate installation is completed for licenses
     * it is valid if we have an valid qlik licens and can access it
     * and if cotentlibrary senseexcel exists
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
     * @throws {LicenseInstallationInvalidException}
     * @returns {Observable<void>}
     * @memberof LicenseValidator
     */
    public isValidateLicenseInstallation(): Observable<void> {

        return this.validateLicenseInstallation()
            .pipe(
                map((validation: ILicenseValidationResult) => {
                    if (!validation.isValid) {
                        const exception = new LicenseInstallationInvalidException('invalid installation');
                        exception.errors = validation.errors;
                        throw exception;
                    }
                })
            );
    }

    /**
     * validates content library exists
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
     * validate qlik license is valid, have access rights
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

    /**
     * validate license key
     *
     * @returns {Observable<ILicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public validateLicenseKey(licenseKey: string): Observable<ILicenseValidationResult> {

        let qlikLicense$;

        if (!this.licenseRepository.qlikSerial) {
            qlikLicense$ = this.licenseRepository.fetchQlikSerialNumber();
        } else {
            qlikLicense$ = of(this.licenseRepository.qlikSerial);
        }

        return qlikLicense$.pipe(
                map((qlikSerial) => {
                    const isValid = qlikSerial === licenseKey;
                    const errors  = [];

                    if (!isValid) {
                        errors.push('Sense Excel Reporting License not matching Qlik Serial.');
                    }

                    return { isValid, errors };
                })
            );
    }
}
