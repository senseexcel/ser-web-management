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
