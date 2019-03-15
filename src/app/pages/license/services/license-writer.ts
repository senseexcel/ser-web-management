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

        /** reduce users array to string */
        return users.reduce((data: string[], licenseUser: ILicenseUser) => {

            /** only add license user if user id is not empty */
            if (licenseUser.id && licenseUser.id.replace(/(^\s*|\s*$)/g, '') !== '') {

                /** sanitize user */
                const userid = licenseUser.id
                    .replace(/(^\s*|\s*$)/g, ''); // trim user

                const {id, from, to} = licenseUser;
                const userData = [id, from, to]
                    .filter((value, index, fullData) => {
                        if (value !== null && value !== undefined) {
                            return true;
                        }

                        /* if value is null or undefined, we have to keep it if any value after that is not
                         * null or undefined
                         */
                        return fullData.slice(index + 1).some((val) => val !== null && val !== undefined);
                    });

                /** replace user id by trimmed user id */
                userData.splice(0, 1, userid);

                /** push user license line into lines array */
                data.push(`${LICENSE_PROPERTIES.USER};${userData.join(';')}`);
            }
            return data;
        }, []).join('\r\n');
    }
}
