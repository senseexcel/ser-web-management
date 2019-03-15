import moment = require('moment');
import { IValidationResult, IUser, IUserLicense } from '../api';
import { LicenseValidator } from './license.validator';
import { toManyUsersAtSameTimeError } from './validation.tokens';

export class UserLicenseValidator extends LicenseValidator {

    /**
     * check users activated are less or equal license user limit
     * if user limit set to -1 there is no user limit
     *
     * @param {LicenseModel} license
     * @returns {Observable<ILicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public validate(license: IUserLicense): IValidationResult {

        const validationResult = super.validate(license);

        /** if no user limit exists or user limit is not reached it is valid */
        if (license.userLimit >= license.users.length) {
            return validationResult;
        }

        const today = moment();

        for (let i = 365; i >= 0; i--) {
            const activeUsers = this.getActiveUsersOnDate(today.add(1, 'day'), license.users);
            if (activeUsers.length > license.userLimit) {
                validationResult.isValid = false;
                validationResult.errors.add(toManyUsersAtSameTimeError);
                break;
            }
        }
        return validationResult;
    }

    /**
     * returns users which are active on date
     */
    private getActiveUsersOnDate(date: moment.Moment, users: IUser[]): IUser[] {
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
