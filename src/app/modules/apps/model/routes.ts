import { Routes, RouterModule } from '@angular/router';
import { AppListComponent, AppEditComponent, AppsComponent } from '../components';

export const AppRoutes: Routes = [{
    path: 'apps',
    component: AppsComponent,
    data: {
        breadcrumb: 'Applications'
    },
    children: [{
        path: '',
        component: AppListComponent,
    }, {
        path: 'edit/:id',
        component: AppEditComponent,
        data: {
            breadcrumb: 'Edit'
        }
    }, {
        path: 'new',
        component: AppEditComponent,
        data: {
            breadcrumb: 'New App'
        }
    }]
}];
