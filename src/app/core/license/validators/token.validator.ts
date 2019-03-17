
import { LicenseValidator } from './license.validator';
import { noLimitError } from './validation.tokens';
import { TokenLicense } from '../model';
import { IValidationResult } from '../api';

export class TokenLicenseValidator extends LicenseValidator {
    /**
     * check users activated are less or equal license user limit
     * if user limit set to -1 there is no user limit
     *
     * @param {LicenseModel} license
     * @returns {Observable<ILicenseValidationResult>}
     * @memberof LicenseValidator
     */
    public validate(license: TokenLicense): IValidationResult {
        const validationResult = super.validate(license);
        if (!this.hasLimit(license.tokens)) {
            validationResult.isValid = false;
            validationResult.errors.add(noLimitError);
        }
        return validationResult;
    }
}
