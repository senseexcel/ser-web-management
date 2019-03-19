import { IUserLicense, IUser } from '../api';
import { LicenseWriter } from './license-writer';

/**
 * convert named license back to string
 */
export class NamedLicenseWriter extends LicenseWriter {

    public write(license: IUserLicense): string {
        const result = [
            ...license.licenseData,
            ...this.writeUser(license.users),
            ...license.data
        ].join('\r\n');
        return result;
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
    private writeUser(users: IUser[]): string[] {

        if (!users.length) {
            return [];
        }

        // filter all users out which has an not empty id
        const validUsers = users.filter((user: IUser) => user.id && user.id.replace(/(^\s*|\s*$)/, '') !== '');
        return validUsers.map((user: IUser) => {
            const userid = user.id.replace(/(^\s*|\s*$)/g, ''); // trim user
            const {from, to} = user;
            const line = `EXCEL_NAME;${userid}`;

            const fromDate = from.isValid() ? from.format('YYYY-MM-DD') : null;
            const toDate   = to.isValid()   ? to.format('YYYY-MM-DD') : null;

            if (!toDate && !fromDate) {
                return line;
            } else if (!fromDate) {
                return `${line};;${toDate}`;
            } else if (!toDate) {
                return `${line};${fromDate}`;
            } else {
                return `${line};${fromDate};${toDate}`;
            }
        });
    }
}
