import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { IQlikLicenseResponse } from '../api/response/qlik-license.interface';
import { InvalidQlikLicenseException } from '../api/exceptions';

@Injectable()
export class LicenseService {

    /**
     * angular http client
     *
     * @private
     * @type {HttpClient}
     * @memberof LicenseService
     */
    private http: HttpClient;

    /**
     * cache for qlik serial number
     *
     * @private
     * @type {BehaviorSubject<string>}
     * @memberof LicenseService
     */
    private qlikSerialNumber$: BehaviorSubject<string>;

    /**
     * flag qlik license serial allready fetched
     *
     * @private
     * @memberof LicenseService
     */
    private qlikSerialIsFetched = false;

    constructor(
        http: HttpClient
    ) {
        this.http = http;
        this.qlikSerialNumber$ = new BehaviorSubject('');
    }

    public validateLicense() {
    }

    /**
     * get current qlik license
     *
     * @returns {Observable<any>}
     * @memberof LicenseService
     */
    public fetchQlikSerialNumber(): Observable<string> {

        if (!this.qlikSerialIsFetched) {
            return this.http.get('/qrs/license')
                .pipe(
                    map((response: IQlikLicenseResponse) => {

                        if (!response || response.isInvalid) {
                            throw new InvalidQlikLicenseException('Qlik License invalid or could not read');
                        }

                        /** serial number */
                        const serial = response.serial;
                        /** set flag serial has been fetched */
                        this.qlikSerialIsFetched = true;
                        // write value into cache so we dont need to fetch again
                        this.qlikSerialNumber$.next(serial);
                        return serial;
                    })
                );
        }

        return this.qlikSerialNumber$;
    }

    /**
     * fetch sense excel reporting license file
     *
     * @returns {Observable<string>}
     * @memberof LicenseService
     */
    public fetchSenseExcelReportingLicense(): Observable<string> {

        return this.fetchQlikSerialNumber().pipe(
            switchMap((qlikSerial: string) => {
                /** calculate checksum */
                const checkSum = this.calculateCheckSum(qlikSerial);

                /** create params */
                const params   = new HttpParams()
                    .set('serial', qlikSerial)
                    .set('chk', String(checkSum));

                /** fetch license for qlik sense excel reporting  */
                return this.http.get('https://support.qlik2go.net/lefupdate/update_lef.asp', { params })
                .pipe(
                    map((response: string) => {
                        return response;
                    })
                );
            })
        );
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
