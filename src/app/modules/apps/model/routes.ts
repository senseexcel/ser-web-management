import { Routes, RouterModule } from '@angular/router';
import { AppListComponent, AppEditComponent, AppsComponent, AppNewComponent  } from '../components';
import { EditGuard } from '../guards/edit.guard';
import { CreateGuard  } from '../guards/create.guard';

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
        path: 'new/:name',
        component: AppEditComponent,
        canActivate: [CreateGuard],
        data: {
            breadcrumb: 'Edit App ' 
        }
    },
        {
            path: 'new',
            component: AppNewComponent,
            canActivate: [CreateGuard],
            data: {
                breadcrumb: 'New App'
            }
        }]
}]
}];
