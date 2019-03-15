import { IValidationResult, ILicense } from '../api';
import moment = require('moment');

export class LicenseValidator {

    public validate(license: ILicense): IValidationResult {

        const result: IValidationResult = {
            isValid: true,
            errors: new WeakSet()
        };

        if (this.isExpired(license.to)) {
        }

        return result;
    }

    private isExpired(expireDate: moment.Moment): boolean {
        if (expireDate.isValid() && !expireDate.isSameOrBefore()) {
            return true;
        }
        return false;
    }
}
