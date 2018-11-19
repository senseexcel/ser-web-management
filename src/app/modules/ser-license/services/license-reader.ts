import { Injectable } from '@angular/core';
import { LicenseModel } from '../model/license.model';
import { ILicenseUser } from '../api/license-user.interface';

@Injectable()
export class LicenseReader {

    /**
     * read lincecontent
     *
     * @param {string} data
     * @returns
     * @memberof LicenseReader
     */
    public read(data: string, license?: LicenseModel): LicenseModel {

        const model: LicenseModel = license || new LicenseModel();
        const parsed              = this.parseLicenseData(data.split(/\r?\n/));

        model.raw   = data;
        model.key   = parsed.licenseData[0];
        model.text  = parsed.licenseData.join('\r\n');
        model.users = this.readUsers(parsed.userData);

        return model;
    }

    /**
     * copy data from one model to another
     *
     * @param {LicenseModel} source
     * @param {LicenseModel} target
     * @memberof LicenseReader
     */
    public copy(source: LicenseModel, target: LicenseModel): LicenseModel {

        target.raw   = source.raw;
        target.key   = source.key;
        target.text  = source.text;
        target.users = [...source.users];

        return target;
    }

    /**
     * parse license data
     *
     * @private
     * @param {string[]} content
     * @returns {*}
     * @memberof LicenseReader
     */
    private parseLicenseData(lines: string[]): any {

        const result = {
            licenseData: [],
            userData: []
        };

        /** loop content array until we find signature line and split */
        for (const [index, line] of Array.from(lines.entries())) {

            const trimmedLine = line.replace(/(^\s*|\s*$)/g, '');

            // skip empty lines
            if (trimmedLine === '' ) {
                continue;
            }

            result.licenseData.push(trimmedLine);

            /** signature match */
            if (trimmedLine.match(/^([A-Z,0-9]{4}(?=-)-){4}[A-Z,0-9]{4}$/)) {
                result.userData = lines.slice(index + 1);
                break;
            }
        }
        return result;
    }

    /**
     *  read users from license data and convert it to license user
     *
     * @private
     * @param {string[]} users
     * @returns {*}
     * @memberof LicenseReader
     */
    private readUsers(users: string[]): ILicenseUser[] {
        return users.map((user): ILicenseUser => {
            const data = user.split(';');

            return {
                id:   data[1] || '',
                from: data[2] || null,
                to:   data[3] || null
            };
        });
    }
}
