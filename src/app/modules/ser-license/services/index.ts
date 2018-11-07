import { ContentLibService } from './contentlib.service';
import { LicenseService } from './license.service';

export * from './contentlib.service';
export * from './license.service';

export const services = [
    ContentLibService,
    LicenseService
];
