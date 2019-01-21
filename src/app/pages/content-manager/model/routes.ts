import { Routes } from '@angular/router';
import { ListComponent } from '../components/list.component';

export const ContentManagerRoutes: Routes = [{
    path: 'content-manager',
    component: ListComponent,
    data: {
        breadcrumb: 'Content Manager'
    }
}];
