import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { IQlikLicenseResponse } from '../api/response/qlik-license.interface';
import {
    QlikLicenseNoAccessException,
    QlikLicenseInvalidException,
    SerLicenseResponseException
} from '../api/exceptions';
/*
import { ContentLibService } from '../api/response/contentlib.service';
import { IContentLibResponse, IContentLibFileReference } from '../../../core/contentlib/api/content-lib.interface';
*/
import { SerLicenseResponse } from '../api/response/ser-license.response';
import { ILicense } from '@smc/modules/license/api';
import { LicenseFactory, LicenseReader } from '@smc/modules/license';
import { IQlikLicense } from '../api/qlik-license.interface';

@Injectable()
export class LicenseRepository {

    /**
     * cache for qlik serial number
     *
     * @private
     * @type {BehaviorSubject<string>}
     * @memberof LicenseService
     */
    private qlikLef: string[];

    constructor(
        private licenseFactory: LicenseFactory,
        private licenseReader: LicenseReader,
        private http: HttpClient
    ) {
        this.http = http;
    }

    /**
     * get current qlik license
     * should placed in qmc module
     */
    public fetchQlikLicenseFile(): Observable<string[]> {
        let serial$: Observable<string[]>;
        if (!this.qlikLef) {
            serial$ = this.http.get<IQlikLicenseResponse>('/qrs/license').pipe(
                catchError((response: HttpErrorResponse) => {
                    if (response.status === 403) {
                        throw new QlikLicenseNoAccessException('No access qlik license.');
                    }
                    throw response;
                }),
                map((response: IQlikLicenseResponse) => {
                    if (!response || response.isInvalid) {
                        throw new QlikLicenseInvalidException('No License found or invalid.');
                    }
                    this.qlikLef = response.lef.split('\r\n');
                    return this.qlikLef;
                })
            );
        } else {
            serial$ = of(this.qlikLef);
        }
        return serial$;
    }

    /**
     * fetch sense excel reporting license from remote server
     *
     * @returns {Observable<string>}
     * @memberof LicenseService
     */
    public fetchSenseExcelReportingLicense(): Observable<string[]> {

        return this.readQlikLicenseFile().pipe(
            switchMap((license: IQlikLicense) => {
                /** calculate checksum */
                const checkSum = this.calculateCheckSum(license.serial);

                /** create params */
                const params = new HttpParams()
                    .set('serial', license.serial)
                    .set('chk', String(checkSum));

                const url = `https://license.senseexcel.com/lefupdate/update_lef.json?${params.toString()}`;

                /** fetch license for qlik sense excel reporting  */
                return this.http.jsonp(url, 'callback')
                    .pipe(
                        catchError((error: HttpErrorResponse) => {
                            throw new SerLicenseResponseException({
                                status: 404,
                                error: 'Could not fetch License from Server'
                            });
                        }),
                        map((response: string | SerLicenseResponse) => {

                            if (response.constructor === String) {
                                response = JSON.parse(<string>response);
                            }

                            const data: SerLicenseResponse = <SerLicenseResponse>response;
                            if (!data.success) {
                                throw new SerLicenseResponseException({
                                    status: data.status_code,
                                    error: data.status
                                });
                            }

                            return data.licenses;
                        }),
                    );
            })
        );
    }

    /**
     * fetch license file
     *
     * @throws SerLicenseNotFoundException
     * @returns {Observable<string>}
     * @memberof LicenseService
     */
    public fetchLicenseFile(): Observable<any> {
        return of(null);
    }

    /**
     * fetch  sense excel reporting license content
     *
     * @returns {Observable<string>}
     * @memberof LicenseService
     */
    public readLicense(): Observable<string> {
        return of('');
    }

    public readQlikLicenseFile(): Observable<IQlikLicense> {
        return this.fetchQlikLicenseFile().pipe(
            switchMap((licenseData: string[]) => {
                const tokenSearch = /^TOKENS/;
                const result = this.licenseReader.search(licenseData, [tokenSearch]);
                const tokens: string[] = result.get(tokenSearch) || [];

                const qlikSerial = licenseData[0];
                let tokensMax: number;

                if (tokens.length) {
                    tokensMax = parseInt(tokens[0].split(';')[1], 10) || -1;
                }

                return of({
                    serial: qlikSerial,
                    tokens: tokensMax
                });
            })
        );
    }

    /**
     * create new file and upload
     *
     * @param {*} data
     * @returns {Observable<string>}
     * @memberof LicenseRepository
     */
    public writeLicense(data): Observable<string> {
        return of('');
    }

    /**
     * read license from qmc/shared content
     *
     * @memberof License
     */
    private createLicense(raw: string): ILicense {
        return this.licenseFactory.createFromRaw(raw);
    }

    /**
     * calculate checksum
     *
     * @private
     * @param {string} serial
     * @returns {number}
     * @memberof LicenseService
     */
    private calculateCheckSum(serial: string): number {
        let chk = 4711;
        serial.split('').forEach((char: string) => {
            chk *= 2;
            if (chk >= 65536) {
                chk -= 65535;
            }
            // tslint:disable-next-line:no-bitwise
            chk ^= char.charCodeAt(0);
        });
        return chk;
    }
}
