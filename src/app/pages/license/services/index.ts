// import { ContentLibService } from './contentlib.service';
import { LicenseRepository } from './license-repository';
import { UserRepository } from './user-repository';

// export * from './contentlib.service';
export * from './license-repository';
export * from './user-repository';

export const services = [
    // ContentLibService,
    LicenseRepository,
    UserRepository
];
