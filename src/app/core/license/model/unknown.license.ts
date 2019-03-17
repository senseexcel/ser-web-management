import { AbstractLicense } from './license';
import { IValidationResult, LicenseType } from '../api';
import { licenseUnknownError } from '../validators/validation.tokens';

export class UnknownLicense extends AbstractLicense {

    public get licenseType(): LicenseType {
        return LicenseType.UNKNOWN;
    }
}
