import { Routes } from '@angular/router';
import { ListComponent } from '../components/list.component';

export const ContentManagerRoutes: Routes = [{
    path: 'sharedcontent',
    component: ListComponent,
    data: {
        breadcrumb: 'Shared Content'
    }
}];
