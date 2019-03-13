import { LicenseModel } from '../model/license.model';
import { ILicenseUser } from '../api/license-user.interface';

export class UserLicense extends LicenseModel {

    private licenseUsers: ILicenseUser[];

    private licenseUserLimit: number;

    public set users(users: ILicenseUser[]) {
        this.licenseUsers = users;
    }

    public set userLimit(limit: number) {
        this.licenseUserLimit = limit;
    }

    public get users(): ILicenseUser[] {
        return this.licenseUsers;
    }

    public get userLimit(): number {
        return this.licenseUserLimit;
    }
}
