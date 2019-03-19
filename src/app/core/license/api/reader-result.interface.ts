import { ILicenseMeta } from './license-meta.interface';

export interface IReaderResult {

    licenseKey: string;

    licenseMeta: ILicenseMeta;

    licenseRaw: string[];

    raw: string[];
}
