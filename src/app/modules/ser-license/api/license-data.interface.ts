import { ILicenseUser } from './license-user.interface';

export interface ILicensData {

    raw: string;

    key: string;

    users: ILicenseUser[];
}
