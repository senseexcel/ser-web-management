import { Injectable } from '@angular/core';
import { LicenseModel } from '../model/license.model';

@Injectable()
export class LicenseReader {

    /**
     * read lincecontent
     *
     * @param {string} data
     * @returns
     * @memberof LicenseReader
     */
    public read(data: string, delimeter = ' '): LicenseModel {
        const model: LicenseModel = new LicenseModel();
        const parsed = this.parseLicenseData(data.split(delimeter));

        model.raw = data.split(delimeter).join('\n');
        model.key = parsed.licenseData[0];
        return model;
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
            /** signature match */
            if (line.match(/^([A-Z,0-9]{4}(?=-)-){4}[A-Z,0-9]{4}$/)) {
                result.licenseData = lines.slice(0, index + 1);
                result.userData    = lines.slice(index + 1);
                break;
            }
        }

        return result;
    }

    private readUsers(content: string[]): any {
        console.log(content);
    }
}
