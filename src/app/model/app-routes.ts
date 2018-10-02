import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AppsModule } from '@apps/apps.module';
import { SerTaskModule } from '@core/modules/ser-task/ser-task.module';

export const AppRoutes: Routes = [{
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
    children: [{
        path: 'apps',
        loadChildren: () => AppsModule
    }, {
        path: 'tasks',
        loadChildren: () => SerTaskModule
    }]
}];
