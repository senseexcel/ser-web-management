import { AbstractLicense } from './license';
import { LicenseType } from '../api/license-type.interface';

export class TokenLicense extends AbstractLicense {

    public get licenseType(): LicenseType {
        return LicenseType.TOKEN;
    }
}
