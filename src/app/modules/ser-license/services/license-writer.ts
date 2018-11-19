import { Injectable } from '@angular/core';
import { LicenseRepository } from './license-repository';
import { LicenseModel } from '../model/license.model';
import { Observable } from 'rxjs';
import { ILicenseUser } from '../api/license-user.interface';
import { LICENSE_PROPERTIES } from '../api/license-data.interface';

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

        const text        = model.text;
        const userData    = this.writeUser(model.users);
        const fullLicense = [text, userData].join('\r\n');
        return this.repository.writeLicense(fullLicense);
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

        return users.reduce((data: string[], licenseUser: ILicenseUser) => {
            /** only add license user if user id is not empty */
            if (licenseUser.id && licenseUser.id.replace(/(^\s*|\s*$)/g, '') !== '') {

                /** sanitize user */
                const userid = licenseUser.id
                    .replace(/(^\s*|\s*$)/g, ''); // trim user

                const userData = Object.values(licenseUser);
                userData.splice(0, 1, userid);

                /** combine user with other values */
                const combinedUser = userData.join(';');

                /** push user license line into lines array */
                data.push(`${LICENSE_PROPERTIES.USER};${combinedUser}`);
            }
            return data;
        }, []).join('\r\n');
    }
}
