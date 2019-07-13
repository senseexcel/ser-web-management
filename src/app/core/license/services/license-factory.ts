import { UnknownLicense, EmptyLicense, SearchTokens, TokenLicense, NamedLicense } from '../model';
import { IReaderResult, IUserLicense, IUser, ILicense, LicenseType } from '../api';
import { LicenseReader } from './license-reader';
import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({providedIn: 'root'})
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
            case LicenseType.UNKNOWN:
                license = this.createUnknownLicense(readerResult);
                break;
            /** user license was found */
            case LicenseType.NAMED:
                license = this.createNamedLicense(readerResult);
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
    public createNamedLicense(data: IReaderResult): IUserLicense {

        const nameToken = SearchTokens.TOKEN_NAME;
        const result = this.reader.extract(data.raw, [nameToken]);
        const users = result.get(nameToken).map((line) => {
            const userData = line.split(';');
            return {
                id:   userData[1] || '',
                from: moment(userData[2] || null),
                to:   moment(userData[3] || null)
            };
        });

        const license = new NamedLicense();
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
        license.tokens = data.licenseMeta.count;
        this.loadDataIntoLicense(data, license);
        return license;
    }

    /**
     * license type was not found, or it is broken
     * in both cases we could not handle license correctly
     * in validation
     */
    private createUnknownLicense(data: IReaderResult): UnknownLicense {
        const license = new UnknownLicense();
        this.loadDataIntoLicense(data, license);
        return license;
    }

    /**
     * load result data from reader into license
     */
    private loadDataIntoLicense(data: IReaderResult, license: ILicense) {
        license.data = data.raw;
        license.from = moment(data.licenseMeta.from || null);
        license.licenseData = data.licenseRaw;
        license.licenseKey = data.licenseKey;
        license.to = moment(data.licenseMeta.to);
    }
}
