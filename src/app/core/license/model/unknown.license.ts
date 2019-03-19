import { AbstractLicense } from './license';
import { LicenseType } from '../api';

export class UnknownLicense extends AbstractLicense {

    public get licenseType(): LicenseType {
        return LicenseType.UNKNOWN;
    }
}
