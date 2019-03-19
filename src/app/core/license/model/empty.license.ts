
import { AbstractLicense } from './license';
import { IValidationResult, LicenseType } from '../api';

export class EmptyLicense extends AbstractLicense {

    public get licenseType(): LicenseType {
        return LicenseType.EMPTY;
    }

    public validate(): IValidationResult {
        return {
            isValid: true,
            errors: new WeakSet()
        };
    }
}
