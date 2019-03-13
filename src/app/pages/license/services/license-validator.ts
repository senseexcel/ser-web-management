import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { ContentLibService } from './contentlib.service';
import { LicenseRepository } from './license-repository';
import { map, catchError, mergeMap, concatMap } from 'rxjs/operators';
import {
    ContentLibNotExistsException,
    QlikLicenseNoAccessException,
    QlikLicenseInvalidException,
    SerLicenseNotFoundException
} from '../api/exceptions';
import { ILicenseValidationResult, ValidationStep } from '../api/validation-result.interface';
import { LicenseModel } from '../model/license.model';
import { HttpClient } from '@angular/common/http';
import { IContentLibFileReference } from '../api/response/content-lib.interface';

@Injectable()
export class LicenseValidator {

    private contentlib: ContentLibService;

    private licenseRepository: LicenseRepository;

    private http: HttpClient;

    public constructor(
        contentlib: ContentLibService,
        http: HttpClient,
        licenseRepository: LicenseRepository
    ) {
        this.contentlib = contentlib;
        this.http = http;
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
            this.validateQlikLicenseInstallation()
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
                    const isValid = !Array.from(validation.values()).some((result) => {
                        return result.isValid === false;
                    });

                    return {
                        isValid,
                        data: validation
                    };
                })
            );
    }

    /**
     * try to fetch license file first check we find file in qmc
     * and if this is the case check file exists logical and send
     * head request to see file exists on server
     *
     * @returns
     * @memberof LicenseValidator
     */
    public validateLicenseExists(): Observable<ILicenseValidationResult> {

        /** get content library first content library */
        return this.licenseRepository.fetchLicenseFile().pipe(
            concatMap((file: IContentLibFileReference) => {
                return this.http.head(file.logicalPath).pipe(
                    catchError(() => {
                        throw new SerLicenseNotFoundException();
                    })
                );
            }),
            map(() => {
                return {
                    isValid: true,
                    errors: []
                };
            }),
            catchError((error: Error) => {
                if (error.constructor === SerLicenseNotFoundException || error.constructor === ContentLibNotExistsException) {
                    const result: ILicenseValidationResult = {
                        isValid: false,
                        errors: ['No license file found.']
                    };
                    return of(result);
                }
                throw error;
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
                                vResult.errors.push('CONTENTLIB_NOT_EXISTS');
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
    public validateQlikLicense(): Observable<ILicenseValidationResult> {

        return this.licenseRepository.fetchQlikSerialNumber().pipe(
            map(() => {
                return {isValid: true, errors: []};
            }),
            catchError((error) => {
                let errMsg: string;
                switch (error.constructor) {
                    case QlikLicenseInvalidException:  errMsg = 'Invalid Qlik License'; break;
                    case QlikLicenseNoAccessException: errMsg = 'No Access: Qlik License'; break;
                    default:
                        throw error;
                }
                return of({
                    isValid: false, errors: [errMsg]
                });
            })
        );
    }

    /**
     * @todo refactoring to use validateQlikLicense
     *
     * @returns {Observable<Map<ValidationStep, ILicenseValidationResult>>}
     * @memberof LicenseValidator
     */
    public validateQlikLicenseInstallation(): Observable<Map<ValidationStep, ILicenseValidationResult>> {
        const validationResults: Map<ValidationStep, ILicenseValidationResult> = new Map();
        const qlikLicensResult: ILicenseValidationResult = {isValid: true, errors: []};

        validationResults.set(ValidationStep.STEP_QLIK_LICENSE_ACCESS, Object.assign({}, qlikLicensResult));
        validationResults.set(ValidationStep.STEP_QLIK_LICENSE_VALID, Object.assign({}, qlikLicensResult));

        let res: ILicenseValidationResult;

        return of(validationResults).pipe(
            mergeMap((result) => this.licenseRepository.fetchQlikSerialNumber()
                .pipe(
                    map(() => result),
                    catchError((error: Error) => {
                        switch (error.constructor) {

                            case QlikLicenseInvalidException:
                                res = validationResults.get(ValidationStep.STEP_QLIK_LICENSE_VALID);
                                res.errors.push('NO_ACCESS_QLIK_LICENSE');
                                res.isValid = false;
                                break;

                            case QlikLicenseNoAccessException:
                                validationResults.delete(ValidationStep.STEP_QLIK_LICENSE_VALID);
                                res = validationResults.get(ValidationStep.STEP_QLIK_LICENSE_ACCESS);
                                res.errors.push('NO_ACCESS_QLIK_LICENSE');
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
                        errors.push('SER_QLIK_NOT_EQUAL');
                    }

                    return { isValid, errors };
                })
            );
    }

    /**
     * validate full license
     *
     * @param {LicenseModel} license
     * @returns {Observable<ILicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public isValid(license: LicenseModel): Observable<ILicenseValidationResult> {

        if (license.raw.replace(/(^\s*|\s*$)/g, '') === '') {
            return of({
                isValid: false,
                errors: ['No license found']
            });
        }

        return forkJoin(
            this.validateLicenseKey(license.key),
            this.validateUsers(license)
        ).pipe(
            map((result: ILicenseValidationResult[]) => {
                return result.reduce(
                    (
                        current: ILicenseValidationResult,
                        next: ILicenseValidationResult
                    ): ILicenseValidationResult => {
                        current.isValid = current.isValid && next.isValid;
                        current.errors  = current.errors.concat(next.errors);
                        return current;
                    },
                    {isValid: true, errors: []}
                );
            })
        );
    }
}
