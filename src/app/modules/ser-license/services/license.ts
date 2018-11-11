import { Injectable } from '@angular/core';
import { LicenseModel } from '../model/license.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LicenseReader } from './license-reader';
import { LicenseRepository } from './license-repository';
import { LicenseWriter } from './license-writer';

@Injectable()
export class License {

    /**
     * license has been loaded/updated
     *
     * @type {BehaviorSubject<LicenseModel>}
     * @memberof License
     */
    public onload$: BehaviorSubject<LicenseModel>;

    /**
     * read data and create/update license model
     *
     * @private
     * @type {LicenseReader}
     * @memberof License
     */
    private reader: LicenseReader;

    /**
     * prepare data and write to repository
     *
     * @private
     * @type {LicenseWriter}
     * @memberof License
     */
    private writer: LicenseWriter;

    /**
     * repository to fetch license data
     *
     * @private
     * @type {LicenseRepository}
     * @memberof License
     */
    private repository: LicenseRepository;

    /**
     *
     *
     * @private
     * @type {LicenseModel}
     * @memberof License
     */
    private model: LicenseModel;

    constructor(
        reader: LicenseReader,
        repository: LicenseRepository,
        writer: LicenseWriter
    ) {
        this.reader     = reader;
        this.writer     = writer;
        this.repository = repository;
        this.model      = new LicenseModel();
        this.onload$    = new BehaviorSubject(this.model);
    }

    /**
     * load license
     *
     * @memberof License
     */
    public loadLicense(): Observable<LicenseModel> {

        return this.repository.readLicense().pipe(
            map((licenseContent: string): LicenseModel => {
                const license = this.reader.read(licenseContent, this.model);
                this.onload$.next(license);
                return license;
            }),
            catchError(() => {
                return of(new LicenseModel());
            })
        );
    }

    /**
     * fetch license from remote server
     *
     * @returns {Observable<LicenseModel>}
     * @memberof License
     */
    public fetchLicense(): Observable<LicenseModel> {
        return this.repository.fetchSenseExcelReportingLicense()
            .pipe(
                map((licenseContent: string) => this.reader.read(licenseContent, this.model)),
                tap((license: LicenseModel)  => this.onload$.next(license))
            );
    }

    /**
     * update license content and read it again
     *
     * @param {string} content
     * @memberof License
     */
    public updateLicense(content: string) {
        this.onload$.next(
            this.reader.read(content.replace(/\n/g, ' '), this.model));
    }

    /**
     * persist license and upload to server
     *
     * @returns
     * @memberof License
     */
    public saveLicense() {
        return this.writer.write(this.model);
    }
}
