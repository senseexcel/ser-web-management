import { LicenseType } from './license-type.interface';

export interface ILicenseMeta {
    count: number;

    from: string;

    to: string;

    type: LicenseType;
}
