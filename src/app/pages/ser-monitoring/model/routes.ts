
import { Routes } from '@angular/router';
import { MonitoringPageComponent } from '../pages';

export const MonitoringRoutes: Routes = [{
    path: 'monitoring',
    component: MonitoringPageComponent,
    data: {
        breadcrumb: 'Monitoring'
    }
}];
