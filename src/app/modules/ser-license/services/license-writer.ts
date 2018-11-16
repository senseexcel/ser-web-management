import { Injectable } from '@angular/core';
import { LicenseRepository } from './license-repository';
import { LicenseModel } from '../model/license.model';
import { Observable } from 'rxjs';
import { ILicenseUser } from '../api/license-user.interface';

@Injectable()
export class LicenseWriter {

    private repository: LicenseRepository;

    constructor(
        repository: LicenseRepository
    ) {
        this.repository = repository;
    }

    /**
     * write data to license and upload to server
     *
     * @param {LicenseModel} model
     * @returns {Observable<string>}
     * @memberof LicenseWriter
     */
    public write(model: LicenseModel): Observable<string> {

        const text = model.text;
        const userData = this.writeUser(model.users);
        const fullLicense = `${text} ${userData}`;

        return this.repository.writeLicense(
            this.sanitizeLicenseData(fullLicense));
    }

    /**
     * convert license users from model into string so it could written
     * into license
     *
     * @private
     * @param {ILicenseUser[]} users
     * @returns {string}
     * @memberof LicenseWriter
     */
    private writeUser(users: ILicenseUser[]): string {

        if (!users.length) {
            return '';
        }

        return users.reduce((data: string[], u: ILicenseUser) => {
            const combinedUser = Object.values(u).join(';');
            data.push(`EXCEL_NAME;${combinedUser}`);
            return data;
        }, []).join(' ');
    }

    /**
     * sanitize license data before it would written into file
     * remove linebreaks, remove empty lines
     *
     * @todo remove double whitespaces
     *
     * @private
     * @param {string} data
     * @returns {string}
     * @memberof LicenseWriter
     */
    private sanitizeLicenseData(data: string): string {
        return data
            /* replace linebreaks by space */
            .replace(/\n/g, ' ')
            /* reduce multiple spaces to one this will also remove empty lines which has become a space */
            .replace(/((\s)\s+)/g, '$2');
    }
}
