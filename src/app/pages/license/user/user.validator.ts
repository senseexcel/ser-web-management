import moment = require('moment');
import { ILicenseValidationResult } from '../api/validation-result.interface';
import { Observable, of } from 'rxjs';
import { ILicenseUser } from '../api/license-user.interface';
import { LicenseValidator } from '../services';
import { UserLicense } from './user.license';

export class UserLicenseValidator extends LicenseValidator {

    /**
     * check users activated are less or equal license user limit
     * if user limit set to -1 there is no user limit
     *
     * @param {LicenseModel} license
     * @returns {Observable<ILicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public isValid(license: UserLicense): Observable<ILicenseValidationResult> {

        const userValidationResult: ILicenseValidationResult = {
            isValid: true,
            errors: []
        };

        /** if no user limit exists or user limit is not reached it is valid */
        if (license.userLimit === -1 && license.userLimit >= license.users.length) {
            return of(userValidationResult);
        }

        const today = moment();

        for (let i = 365; i >= 0; i--) {
            const activeUsers = this.getActiveUsersOnDate(today.add(1, 'day'), license.users);
            if (activeUsers.length > license.userLimit) {
                userValidationResult.isValid = false;
                userValidationResult.errors  = ['TO_MANY_USERS'];
                break;
            }
        }

        return of(userValidationResult);
    }

    /**
     * returns users which are active on date
     *
     * @private
     * @param {moment.Moment} date
     * @param {ILicenseUser[]} users
     * @returns {ILicenseUser[]}
     * @memberof LicenseValidator
     */
    private getActiveUsersOnDate(date: moment.Moment, users: ILicenseUser[]): ILicenseUser[] {
        /** filter for active users */
        return users.filter((user) => {
            const {from, to} = user;
            let isActive = true;
            isActive = isActive && (!Boolean(from) || date.isSameOrAfter(from, 'day'));
            isActive = isActive && (!Boolean(to)   || date.isSameOrBefore(to , 'day'));
            return isActive;
        });
    }
}
