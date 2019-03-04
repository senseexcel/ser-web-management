import { Injectable } from '@angular/core';
import { LicenseModel } from '../model/license.model';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, switchMap, mergeMap  } from 'rxjs/operators';
import { LicenseReader } from './license-reader';
import { LicenseRepository } from './license-repository';
import { LicenseWriter } from './license-writer';
import { LicenseValidator } from './license-validator';
import { ILicenseUser } from '../api/license-user.interface';
import { LICENSE_PROPERTIES } from '../api/license-data.interface';
import { SerLicenseResponseException } from '../api/exceptions';

@Injectable()
export class License {

    public onload$: BehaviorSubject<LicenseModel>;
    public update$: Subject<LicenseModel>;

    private model: LicenseModel;

    constructor(
        private reader: LicenseReader,
        private repository: LicenseRepository,
        private writer: LicenseWriter,
        private validator: LicenseValidator
    ) {
        this.model      = new LicenseModel();
        this.onload$    = new BehaviorSubject(this.model);
        this.update$    = new Subject();
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
            mergeMap((license: LicenseModel) => {
                return this.validator.validateLicense(license)
                    .pipe(
                        map((validationResult) => {
                            license.validationResult = validationResult;
                            return license;
                        })
                    );
            })
        );
    }

    /**
     * fetch license from remote server
     *
     * @throws {SerLicenseResponseException}
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

                    /** no license found throw an exception */
                    if (!excelLicense.length) {
                        throw new SerLicenseResponseException({
                            status: 404,
                            error: 'No license found'
                        });
                    }
                    return excelLicense;
                }),
                switchMap((licenseContent: string) => this.updateLicense(licenseContent))
            );
    }

    public update() {
        this.update$.next(this.model);
    }

    /**
     * update license content and read it again
     *
     * @param {string} content
     * @memberof License
     */
    public updateLicense(content: string | LicenseModel): Observable<LicenseModel> {

        let license;
        if (content instanceof LicenseModel) {
            license = this.reader.copy(content, this.model);
        } else {
            license = this.reader.read(content, this.model);
        }

        return this.validator.validateLicense(license)
            .pipe(
                map((validationResult) => {
                    license.validationResult = validationResult;
                    this.onload$.next(license);
                    return license;
                })
            );
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
        this.update();
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
            const {id, from, to} = user;
            const userData = [id, from, to].filter((value, index, fullData) => {

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
