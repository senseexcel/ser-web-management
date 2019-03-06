import { ProcessListComponent } from './process-list/process-list.component';
import { MonitoringPageComponent } from './monitoring.page';

export * from './process-list/process-list.component';

export const DECLARATION_COMPONENTS = [
    ProcessListComponent,
    MonitoringPageComponent
];

export const ENTRY_COMPONENTS = [
    MonitoringPageComponent
];
