import { Routes, RouterModule } from '@angular/router';
import { AppListComponent, AppEditComponent, AppsComponent } from '../components';
import { EditGuard } from '../guards/edit.guard';

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
        canActivate: [EditGuard],
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
