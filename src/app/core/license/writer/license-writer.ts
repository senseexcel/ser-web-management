import { ILicense } from '../api/license.interface';

export class LicenseWriter {

    public write(license: ILicense): string {
        return [
            ...license.licenseData,
            ...license.data
        ].join('\r\n');
    }
}
