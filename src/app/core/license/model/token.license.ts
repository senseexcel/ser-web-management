import { AbstractLicense } from './license';
import { LicenseType } from '../api/license-type.interface';

export class TokenLicense extends AbstractLicense {

    private _tokens: number;

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
