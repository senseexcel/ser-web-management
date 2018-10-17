import { Routes } from '@angular/router';
import { AppListComponent, AppEditComponent, AppsComponent, AppNewComponent  } from '../components';
import { EditGuard } from '../guards/edit.guard';
import { CreateGuard  } from '../guards/create.guard';
import { ReportPreviewComponent } from '@apps/components/preview/preview.component';
import { ListComponent, EditComponent } from '@core/modules/ser-task/components';
import { TasksComponent } from '@apps/components/tasks/task.component';

export const AppRoutes: Routes = [{
    path: 'apps',
    component: AppsComponent,
    data: {
        breadcrumb: 'Reports'
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
        }, {
            path: 'tasks/:id',
            component: TasksComponent,
            data: {
                breadcrumb: 'Tasks',
            },
            children: [{
                path: '',
                component: ListComponent
            }, {
                path: 'edit/:id',
                component: EditComponent,
                data: {
                    breadcrumb: 'Edit Task',
                    action: 'update'
                }
            }, {
                path: 'new',
                component: EditComponent,
                data: {
                    breadcrumb: 'Create Task',
                    action: 'create'
                }
            }]
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
