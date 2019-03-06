
import { Routes } from '@angular/router';
import { MonitoringPageComponent } from '../components/monitoring.page';
import { ProcessListComponent } from '../components';
import { MonitoringCanActivate } from '../services/can-activate.guard';

export const MonitoringRoutes: Routes = [{
    path: 'monitoring',
    component: MonitoringPageComponent,
    data: {
        breadcrumb: 'Monitoring'
    },
    children: [{
        path: '',
        component: ProcessListComponent,
        canActivate: [MonitoringCanActivate]
    }]
}];
