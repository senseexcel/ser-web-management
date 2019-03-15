import { LicenseReader } from '../services/license-reader';
import { LicenseWriter } from '../services/license-writer';

export abstract class License {

    public constructor(
        protected reader: LicenseReader,
        protected writer: LicenseWriter
    ) {
    }

    public abstract toString(): string;
}
