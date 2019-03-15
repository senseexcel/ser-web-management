import { ILicenseMeta } from './license-meta.interface';

export interface IReaderResult {
    licenseMeta: ILicenseMeta;

    licenseRaw: string[];

    raw: string[];
}

/*
// abstract factory to create a license

// reader for license files
public class Reader {

    read(data: string): IReaderResult {
    }

    private parse() {
    }

    // read out license meta data
    private parseLicenseMeta() {
    }

    // parse license raw
    private parseLicenseRaw() {
    }

    public extractLinesByToken(token: string) {
    }
}

// somewhere in our awesome code
// read license data
result = reader.read(): IReaderResult
switch (result.licenseMeta.type) {
    case LicenseType.USER:
        license = this.licenseFactory.createUserLicense(result: IReaderResult);
        break;
    case LicenseType.TOKEN:
        license = this.licenseFactory.createTokenLicense(result: IReaderResult);
        break;
    default:
        throw new Error('no valid license');
}
return license;
*/
