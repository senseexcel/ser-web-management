import { ContentLibService } from './contentlib.service';
import { License } from './license';
import { LicenseRepository } from './license-repository';
import { LicenseValidator } from './license-validator';
import { LicenseReader } from './license-reader';

export * from './contentlib.service';
export * from './license';
export * from './license-repository';
export * from './license-validator';

export const services = [
    ContentLibService,
    License,
    LicenseReader,
    LicenseRepository,
    LicenseValidator
];
