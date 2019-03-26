import { ProcessService } from './process.service';
import { MonitoringCanActivate } from './can-activate.guard';

export * from './process.service';

export const services = [
    MonitoringCanActivate,
    ProcessService
];
