import { AbstractLicense } from './license';
import { IValidationResult, LicenseType } from '../api';
import { invalidLicenseError } from '../validators/validation.tokens';

export class InvalidLicense extends AbstractLicense {

    public get licenseType(): LicenseType {
        return LicenseType.INVALID;
    }

    public validate(): IValidationResult {
        return {
            isValid: false,
            errors : new WeakSet([invalidLicenseError])
        };
    }
}
