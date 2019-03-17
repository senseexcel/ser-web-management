import moment = require('moment');
import { IValidationResult, IUser, IUserLicense } from '../api';
import { LicenseValidator } from './license.validator';
import { toManyUsersAtSameDateError, noLimitError } from './validation.tokens';

export class NamedLicenseValidator extends LicenseValidator {

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
        if (!this.hasLimit(license.userLimit)) {
            validationResult.isValid = false;
            validationResult.errors.add(noLimitError);
        } else if (license.userLimit < license.users.length && !this.validateActiveUsersAtSameTime(license)) {
            /**
             * if we added more users as we have a user limit we need to check
             * that users are spread out so they dont use the same time
             */
            validationResult.isValid = false;
            validationResult.errors.add(toManyUsersAtSameDateError);
        }
        return validationResult;
    }

    /**
     * since we can add more users as limit to license
     * we have to check how many users uses the license at the same time
     */
    private validateActiveUsersAtSameTime(license): boolean {
        const today = moment();
        let isValid = true;
        for (let i = 365; i >= 0; i--) {
            const activeUsers = this.getActiveUsersOnDate(today.add(1, 'day'), license.users);
            if (activeUsers.length > license.userLimit) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    /**
     * returns users which are active on date
     */
    private getActiveUsersOnDate(date: moment.Moment, users: IUser[]): IUser[] {
        /** filter for active users */
        return users.filter((user) => {
            const { from, to } = user;

            let isActive = true;
            isActive = isActive && (!from.isValid() || date.isSameOrAfter(from, 'day'));
            isActive = isActive && (!to.isValid() || date.isSameOrBefore(to, 'day'));
            return isActive;
        });
    }
}
