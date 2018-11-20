import { Injectable } from '@angular/core';
import { LicenseModel } from '../model/license.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {  map } from 'rxjs/operators';
import { LicenseReader } from './license-reader';
import { LicenseRepository } from './license-repository';
import { LicenseWriter } from './license-writer';
import { ILicenseUser } from '../api/license-user.interface';
import { LICENSE_PROPERTIES } from '../api/license-data.interface';

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
                map((content: string[]): string => {
                    /** filter excel licenses for string EXCEL and save first value in excelLicense */
                    const [excelLicense] = [...content.filter((license: string) => {
                        return license.match(/EXCEL_/m);
                    })];
                    return excelLicense;
                }),
                map((licenseContent: string) => this.updateLicense(licenseContent))
            );
    }

    /**
     * update license content and read it again
     *
     * @param {string} content
     * @memberof License
     */
    public updateLicense(content: string | LicenseModel): LicenseModel {

        let license;
        if (content instanceof LicenseModel) {
            license = this.reader.copy(content, this.model);
        } else {
            license = this.reader.read(content, this.model);
        }
        this.onload$.next(license);
        return this.model;
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

    /**
     * adds new user to license
     *
     * @param {ILicenseUser} user
     * @memberof License
     */
    public addUser(user: ILicenseUser) {

        if (!user.id || !user.id.replace(/(^\s|\s$)/g, '').length ) {
            return;
        }

        this.model.users.push(user);
        this.onload$.next(this.model);
    }

    /**
     * delete user from model
     *
     * @param {ILicenseUser} user
     * @returns
     * @memberof License
     */
    public deleteUser(user: ILicenseUser) {
        const index = this.model.users.indexOf(user);

        if (index === -1) {
            return;
        }

        this.model.users.splice(index, 1);
        this.onload$.next(this.model);
    }

    /**
     * adds new user to license
     *
     * @param {ILicenseUser} user
     * @memberof License
     */
    public get raw(): string {
        const text = this.model.text;
        const raw = this.model.users.reduce((rawData: string, user: ILicenseUser) => {
            if (!user.id || !user.id.replace(/(^\s|\s$)/g, '').length ) {
                return rawData;
            }

            // create new user line for raw
            const userData = Object.values(user).filter((value, index, fullData) => {

                if (value !== null && value !== undefined) {
                    return true;
                }

                return fullData.slice(index + 1).some((val) => {
                    return val !== null && val !== undefined;
                });
            });

            const lineData = [].concat([LICENSE_PROPERTIES.USER, ...userData]);

            // concat current raw data with user line
            return `${rawData}\n${lineData.join(';')}`;
        }, text);
        return raw;
    }
}
