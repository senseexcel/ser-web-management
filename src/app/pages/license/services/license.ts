import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LicenseRepository } from './license-repository';
import { SerLicenseResponseException } from '../api/exceptions';
import { LicenseFactory, LicenseReader, LicenseType } from '@smc/modules/license';
import { ILicense } from '@smc/modules/license/api';

@Injectable()
export class License {

    public update$: Subject<any>;

    constructor(
        private licenseFactory: LicenseFactory,
        private licenseReader: LicenseReader,
        private repository: LicenseRepository,
    ) {
        this.update$ = new Subject();
    }

    /**
     * fetch license from remote server
     *
     * @throws {SerLicenseResponseException}
     * @returns {Observable<string>}
     * @memberof License
     */
    public readLicenseFile(): Observable<ILicense> {
        return this.repository.fetchSenseExcelReportingLicense()
            .pipe(
                map((content: string[]): string => {
                    /** filter excel licenses for string EXCEL and save first value in excelLicense */
                    const [excelLicense] = [...content.filter((license: string) => {
                        return license.match(/EXCEL_/m);
                    })];

                    /** no license found throw an exception */
                    if (!excelLicense.length) {
                        throw new SerLicenseResponseException({
                            status: 404,
                            error: 'No license found'
                        });
                    }
                    return excelLicense;
                }),
                map((raw) => this.createLicense(raw))
            );
    }

    /**
     * load license file from content library
     */
    public loadLicenseFile(): Observable<ILicense> {
        return this.repository.readLicense()
            .pipe(map((raw) => this.createLicense(raw)));
    }

    public update() {
    }

    /**
     * update license content and read it again
     *
     * @param {string} content
     * @memberof License
     */
    public updateLicense(content: string): void {
    }

    /**
     * persist license and upload to server
     *
     * @returns
     * @memberof License
     */
    public saveLicense() {
    }

    /**
     * read license from qmc/shared content
     *
     * @memberof License
     */
    private createLicense(raw: string): ILicense {
        return this.licenseFactory.createFromRaw(raw);
    }
}
