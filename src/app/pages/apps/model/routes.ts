import { Routes } from '@angular/router';
import { AppListComponent, AppEditComponent, AppsComponent, AppNewComponent  } from '../components';
import { EditGuard } from '../guards/edit.guard';
import { ReportPreviewComponent } from '../components/preview/preview.component';
import { ListComponent, EditComponent } from '@smc/pages/tasks/components';
import { TasksComponent } from '../components/tasks/task.component';

export const AppRoutes: Routes = [{
    path: 'apps',
    component: AppsComponent,
    data: {
        breadcrumb: 'Reporting Apps'
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
                    action: 'update',
                    isApp: true
                }
            }, {
                path: 'new',
                component: EditComponent,
                data: {
                    breadcrumb: 'Create Task',
                    action: 'create',
                    isApp: true
                }
            }]
        }]
    }, {
        path: 'new',
        component: AppNewComponent,
        data: {
            breadcrumb: 'New App',
        }
    }, {
        path: 'new/:id',
        component: AppEditComponent,
        canActivate: [EditGuard],
        data: {
            breadcrumb: 'New App',
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
                    action: 'update',
                    isApp: true
                }
            }, {
                path: 'new',
                component: EditComponent,
                data: {
                    breadcrumb: 'Create Task',
                    action: 'create',
                    isApp: true
                }
            }]
        }]
    }]
}];
