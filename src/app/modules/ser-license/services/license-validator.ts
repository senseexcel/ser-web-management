import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { ContentLibService } from './contentlib.service';
import { LicenseRepository } from './license-repository';
import { map, catchError, mergeMap } from 'rxjs/operators';
    import {
        ContentLibNotExistsException,
        QlikLicenseNoAccessException,
        QlikLicenseInvalidException,
} from '../api/exceptions';
import { ILicenseValidationResult, ValidationStep } from '../api/validation-result.interface';

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
    public validateLicenseInstallation(): Observable<Map<ValidationStep, ILicenseValidationResult>> {

        return forkJoin([
            this.validateContentLibrary(),
            this.validateQlikLicense()
        ]).pipe(
            map((res: Map<ValidationStep, ILicenseValidationResult>[]) => {
                const result: Map<ValidationStep, ILicenseValidationResult> = new Map(
                    [...Array.from(res[0]), ...Array.from(res[1])]
                );
                return result;
            })
        );
    }

    /**
     *
     * @throws {LicenseInstallationInvalidException}
     * @returns {Observable<void>}
     * @memberof LicenseValidator
     */
    public isValidLicenseInstallation(): Observable<any> {

        return this.validateLicenseInstallation()
            .pipe(
                map((validation) => {
                    const isValid = Array.from(validation.values()).some((result) => {
                        return result.isValid !== false;
                    });

                    return {
                        isValid,
                        data: validation
                    };
                })
            );
    }

    /**
     * validates content library exists
     *
     * @returns {Observable<LicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public validateContentLibrary(): Observable<Map<ValidationStep, ILicenseValidationResult>> {

        const validationResults: Map<ValidationStep, ILicenseValidationResult> = new Map();
        const contentLibResult: ILicenseValidationResult = {isValid: true, errors: []};

        validationResults.set(ValidationStep.STEP_CONTENT_LIBRARY_EXISTS, Object.assign({}, contentLibResult));

        return of(validationResults).pipe(
            mergeMap((result) => this.contentlib.fetchContentLibrary()
                .pipe(
                    map(() => result),
                    catchError((error: Error) => {
                        switch (error.constructor) {
                            case ContentLibNotExistsException:
                                const vResult  = validationResults.get(ValidationStep.STEP_CONTENT_LIBRARY_EXISTS);
                                vResult.isValid = false;
                                vResult.errors.push('Content Library senseexcel does not exists');
                                break;
                            default:
                                throw error;
                        }
                        return of(validationResults);
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
    public validateQlikLicense(): Observable<Map<ValidationStep, ILicenseValidationResult>> {

        const validationResults: Map<ValidationStep, ILicenseValidationResult> = new Map();
        const qlikLicensResult: ILicenseValidationResult = {isValid: true, errors: []};

        validationResults.set(ValidationStep.STEP_QLIK_LICENSE_ACCESS, Object.assign({}, qlikLicensResult));
        validationResults.set(ValidationStep.STEP_QLIK_LICENSE_VALID, Object.assign({}, qlikLicensResult));

        let res: ILicenseValidationResult;

        return of(validationResults).pipe(
            mergeMap((result) => this.licenseRepository.fetchQlikSerialNumber()
                .pipe(
                    /** just return validation result will, skipped if fetchQlikSerialNumber throws an error */
                    map(() => result),
                    catchError((error: Error) => {
                        switch (error.constructor) {

                            case QlikLicenseInvalidException:
                                res = validationResults.get(ValidationStep.STEP_QLIK_LICENSE_VALID);
                                res.errors.push('No Access: Qlik License');
                                res.isValid = false;
                                break;

                            case QlikLicenseNoAccessException:
                                validationResults.delete(ValidationStep.STEP_QLIK_LICENSE_VALID);
                                res = validationResults.get(ValidationStep.STEP_QLIK_LICENSE_ACCESS);
                                res.errors.push('No Access: Qlik License');
                                res.isValid = false;
                                break;

                            default:
                                throw error;
                        }
                        return of(validationResults);
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
