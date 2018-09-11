import { Routes, RouterModule } from '@angular/router';
import { AppListComponent, AppEditComponent, AppsComponent, AppNewComponent  } from '../components';
import { EditGuard } from '../guards/edit.guard';
import { CreateGuard  } from '../guards/create.guard';
import { ReportPreviewComponent } from '@apps/components/preview/preview.component';

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
            breadcrumb: 'Edit',
            page: 'detail'
        },
        children: [{
            path: 'preview',
            component: ReportPreviewComponent,
            data: {
                breadcrumb: 'Report Preview'
            }
        }]
    }, {
        path: 'new',
        component: AppNewComponent,
        canActivate: [CreateGuard],
        data: {
            breadcrumb: 'New App',
        }
    }, {
        path: 'new/:name',
        component: AppEditComponent,
        canActivate: [CreateGuard],
        data: {
            breadcrumb: 'New App',
            page: 'detail'
        },
        children: [{
            path: 'preview',
            component: ReportPreviewComponent,
            canActivate: [CreateGuard],
            data: {
                breadcrumb: 'Report Preview'
            }
        }]
    }]
}];
