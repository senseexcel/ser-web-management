import { Routes, RouterModule } from '@angular/router';
import { AppListComponent, AppEditComponent, QlikAppComponent } from '@qlik/components';

export const QlikRoutes: Routes = [{
    path: 'apps',
    component: QlikAppComponent,
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
