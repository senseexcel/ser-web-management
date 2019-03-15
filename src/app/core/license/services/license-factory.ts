import { UserLicense, TokenLicense } from '../model';
import { IReaderResult, IUserLicense, IUser, ILicense } from '../api';
import { LicenseReader } from './license-reader';
import { SearchTokens } from '../model/search.tokens';
import { Injectable } from '@angular/core';
import moment = require('moment');

@Injectable()
export class LicenseFactory {

    private reader: LicenseReader = new LicenseReader();

    /**
     * return user license
     */
    public createUserLicense(data: IReaderResult): IUserLicense {

        const nameToken = SearchTokens.TOKEN_NAME;
        const result = this.reader.extract(data.raw, [nameToken]);
        const users = result.get(nameToken).map((line) => this.mapToUser(line));

        const license = new UserLicense();
        license.userLimit = data.licenseMeta.count;
        license.addUsers(users);
        this.loadDataIntoLicense(data, license);

        return license;
    }

    /**
     * return token license
     */
    public createTokenLicense(data: IReaderResult): TokenLicense {
        const license = new TokenLicense();
        this.loadDataIntoLicense(data, license);
        return license;
    }

    /**
     *
     */
    private loadDataIntoLicense(data: IReaderResult, license: ILicense) {
        license.data        = data.raw;
        license.from        = moment(data.licenseMeta.from);
        license.licenseData = data.licenseRaw;
        license.licenseKey  = data.licenseKey;
        license.to          = moment(data.licenseMeta.to);
    }

    /**
     *
     */
    private mapToUser(source: string): IUser {
        const data = source.split(';');
        return {
            id: data[1] || '',
            from: data[2] || '-',
            to: data[3] || '-'
        };
    }
}
