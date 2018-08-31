import { Routes, RouterModule } from '@angular/router';
import { AppListComponent, AppEditComponent, AppNewComponent, QlikAppComponent } from '@qlik/components';

export const QlikRoutes: Routes = [{
    path: 'apps',
    component: QlikAppComponent,
    children: [{
        path: '',
        component: AppListComponent,
    }, {
        path: 'edit/:id',
        component: AppEditComponent,
    }, {
        path: 'add',
        component: AppNewComponent,
    }]
}];
