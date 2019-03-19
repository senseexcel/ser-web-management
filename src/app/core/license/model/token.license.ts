import { AbstractLicense } from './license';
import { LicenseType } from '../api/license-type.interface';
import { TokenLicenseValidator } from '../validators/token.validator';

export class TokenLicense extends AbstractLicense {

    private _tokens: number;

    protected validator = new TokenLicenseValidator();

    public get licenseType(): LicenseType {
        return LicenseType.TOKEN;
    }

    public set tokens(count: number) {
        this._tokens = count;
    }

    public get tokens() {
        return this._tokens;
    }
}
