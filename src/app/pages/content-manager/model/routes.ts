
import { Routes } from '@angular/router';
import { ContentManagerPageComponent } from '../pages/page.component';

export const ContentManagerRoutes: Routes = [{
    path: 'content-manager',
    component: ContentManagerPageComponent,
    data: {
        breadcrumb: 'Content Manager'
    }
}];
