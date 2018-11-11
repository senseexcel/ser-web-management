import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, switchMap, tap, catchError, retryWhen } from 'rxjs/operators';
import { IQlikLicenseResponse } from '../api/response/qlik-license.interface';
import { QlikLicenseNoAccessException, QlikLicenseInvalidException, SerLicenseNotFoundException } from '../api/exceptions';
import { ContentLibService } from './contentlib.service';
import { IContentLibResponse, IContentLibFileReference } from '../api/response/content-lib.interface';

@Injectable()
export class LicenseRepository {

    /**
     * cache for qlik serial number
     *
     * @private
     * @type {BehaviorSubject<string>}
     * @memberof LicenseService
     */
    private qlikSerialNumber: string;

    private contentLib: ContentLibService;

    /**
     * angular http client
     *
     * @private
     * @type {HttpClient}
     * @memberof LicenseService
     */
    private http: HttpClient;

    constructor(
        contentLib: ContentLibService,
        http: HttpClient
    ) {
        this.contentLib = contentLib;
        this.http = http;
    }

    public get qlikSerial() {
        return this.qlikSerialNumber;
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
                    const serial = response.serial || '';
                    // write value into cache so we dont need to fetch again
                    this.qlikSerialNumber = serial;
                    return serial;
                })
            );
    }

    /**
     * fetch sense excel reporting license from remote server
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

                // const url = `https://support.qlik2go.net/lefupdate/update_lef.asp?${params.toString()}`;
                const url = `http://localhost:3000?${params.toString()}`;

                /** fetch license for qlik sense excel reporting  */
                return this.http.jsonp(url, 'licenseResponse')
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
     * @throws SerLicenseNotFoundException
     * @returns {Observable<string>}
     * @memberof LicenseService
     */
    public fetchLicenseFile(): Observable<IContentLibFileReference> {

        return this.contentLib.fetchContentLibrary().pipe(
            map((library: IContentLibResponse) => {

                /** filter all files for license.txt file */
                const files = library.references.filter((file: IContentLibFileReference) => {
                    const p: RegExp = new RegExp('senseexcel/license.txt$');
                    if (file.logicalPath.match(p)) {
                        return true;
                    }
                    return false;
                });

                if (!files.length) {
                    throw new SerLicenseNotFoundException();
                }

                return files[0];
            })
        );
    }

    /**
     * fetch  sense excel reporting license content
     *
     * @returns {Observable<string>}
     * @memberof LicenseService
     */
    public readLicense(): Observable<string> {

        let retryAttempts = 0;

        return this.fetchLicenseFile()
            .pipe(
                /** retry to create file if no license.txt exists, for max 1 time */
                retryWhen((errors) => {
                    const createFile$ = this.contentLib.createFile('license.txt', this.createLicenseFile());
                    return errors.pipe(
                        switchMap((error) => {
                            retryAttempts += 1;
                            if (error instanceof SerLicenseNotFoundException && retryAttempts === 1) {
                                return createFile$;
                            }
                        }),
                    );
                }),
                switchMap((file: IContentLibFileReference) => {
                    return this.contentLib.readFile(file);
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
        // tslint:disable-next-line:max-line-length
        return new Blob([], {type: 'text/plain'});
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
