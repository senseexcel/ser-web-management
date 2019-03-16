import { BrokenLicense, EmptyLicense, SearchTokens, TokenLicense, UserLicense } from '../model';
import { IReaderResult, IUserLicense, IUser, ILicense, LicenseType } from '../api';
import { LicenseReader } from './license-reader';
import { Injectable } from '@angular/core';
import moment = require('moment');

@Injectable()
export class LicenseFactory {

    private reader: LicenseReader = new LicenseReader();

    /**
     * construct concrete license by string, if reader
     * throws an error this will be automatically an
     * broken license
     */
    public createFromRaw(raw: string): ILicense {
        let license: ILicense;
        const readerResult = this.reader.read(raw);
        switch (readerResult.licenseMeta.type) {
            /** unknown or broken license was found */
            case LicenseType.BROKEN:
                license = this.createBrokenLicense(readerResult);
                break;
            /** user license was found */
            case LicenseType.USER:
                license = this.createUserLicense(readerResult);
                break;
            /** token license was found */
            case LicenseType.TOKEN:
                license = this.createTokenLicense(readerResult);
                break;
            /** empty license file found */
            default:
                license = this.createEmptyLicense();
        }
        return license;
    }

    /**
     * create empty license, this will allways validate
     */
    public createEmptyLicense(): EmptyLicense {
        return new EmptyLicense();
    }

    /**
     * create a user license from dataset
     */
    public createUserLicense(data: IReaderResult): IUserLicense {

        const nameToken = SearchTokens.TOKEN_NAME;
        const result = this.reader.extract(data.raw, [nameToken]);
        const users = result.get(nameToken).map((line) => {
            const userData = line.split(';');
            return {
                id:   userData[1] || '',
                from: moment(userData[2] || '-'),
                to:   moment(userData[3] || '-')
            };
        });

        const license = new UserLicense();
        license.userLimit = data.licenseMeta.count;
        license.addUsers(users);
        this.loadDataIntoLicense(data, license);

        return license;
    }

    /**
     * create token license from dataset
     */
    public createTokenLicense(data: IReaderResult): TokenLicense {
        const license = new TokenLicense();
        this.loadDataIntoLicense(data, license);
        return license;
    }

    /**
     * license type was not found, or it is broken
     * in both cases we could not handle license correctly
     * in validation
     */
    private createBrokenLicense(data: IReaderResult): BrokenLicense {
        const license = new BrokenLicense();
        this.loadDataIntoLicense(data, license);
        return license;
    }

    /**
     * load result data from reader into license
     */
    private loadDataIntoLicense(data: IReaderResult, license: ILicense) {
        license.data = data.raw;
        license.from = moment(data.licenseMeta.from);
        license.licenseData = data.licenseRaw;
        license.licenseKey = data.licenseKey;
        license.to = moment(data.licenseMeta.to);
    }
}