import { IValidationResult, ILicense } from '../api';
import moment = require('moment');
import { licenseExpiredError, licenseNotActiveYetError } from './validation.tokens';

export class LicenseValidator {

    public validate(license: ILicense): IValidationResult {

        const result: IValidationResult = {
            isValid: true,
            errors: new WeakSet()
        };

        if (this.isExpired(license.to)) {
            result.isValid = false;
            result.errors.add(licenseExpiredError);
        }

        if (this.isNotActive(license.from)) {
            result.isValid = false;
            result.errors.add(licenseNotActiveYetError);
        }

        return result;
    }

    /**
     * isNaN works not that great to check it is a number
     * the most cases could be catched via isNaN(parseInt(value, 10));
     * but this will also convert a string like ab12 to a number -> 12
     */
    protected hasLimit(count): boolean {
        const parsedCount = parseInt(count, 10);
        if (!count || isNaN(parsedCount) || parsedCount <= 0) {
            return false;
        }
        // to be sure we dont have add a string for example '123abc'
        return /^(?!.*?\D).*$/.test(String(count));
    }

    /**
     * returns true if license is allready expired
     */
    private isExpired(expireDate: moment.Moment): boolean {
        const today = moment();
        if (expireDate.isValid() && expireDate.isBefore(today)) {
            return true;
        }
        return false;
    }

    /**
     * license is not active yet, that means the date the license
     * will activated is in future
     */
    private isNotActive(activationDate: moment.Moment): boolean {
        const today = moment();
        if (activationDate.isValid() && activationDate.isAfter(today)) {
            return true;
        }
        return false;
    }
}
