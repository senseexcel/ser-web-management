import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, fromEvent } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { IQlikLicenseResponse } from '../api/response/qlik-license.interface';
import { QlikLicenseNoAccessException, QlikLicenseInvalidException } from '../api/exceptions';
import { ContentLibService } from './contentlib.service';
import { IContentLibResponse, IContentLibFileReference } from '../api/response/content-lib.interface';

@Injectable()
export class LicenseService {

    private contentLib: ContentLibService;

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
        contentLib: ContentLibService,
        http: HttpClient
    ) {
        this.contentLib = contentLib;
        this.http = http;
        this.qlikSerialNumber$ = new BehaviorSubject('');
    }

    public validateLicense() {
    }

    /**
     * get current qlik license
     *
     * @throws {QlikLicenseInvalidException}
     * @throws {QlikLicenseNoAccessException}
     * @returns {Observable<any>}
     * @memberof LicenseService
     */
    public fetchQlikSerialNumber(): Observable<string> {

        if (!this.qlikSerialIsFetched) {
            return this.http.get('/qrs/license')
                .pipe(
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
     * fetch license file
     *
     * @returns {Observable<string>}
     * @memberof LicenseService
     */
    public fetchLicenseFile(): Observable<string> {

        return this.contentLib.fetchContentLibrary().pipe(
            switchMap((library: IContentLibResponse) => {

                const files = library.references.filter((file: IContentLibFileReference) => {
                    const p: RegExp = new RegExp('senseexcel/license.txt$');
                    if (file.logicalPath.match(p)) {
                        return true;
                    }
                    return false;
                });

                const licenseFile = files[0];
                console.log(files);

                if (!licenseFile) {
                    return this.contentLib.createFile('license.txt', this.createLicenseFile());
                } else {
                    // load file
                    return this.contentLib.readFile(licenseFile);
                }
            })
        );
    }

    /**
     * create license file
     *
     * @returns {FileReader}
     * @memberof LicenseService
     */
    private createLicenseFile(): Blob {
        return new Blob([''], {type: 'text/plain'});
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
