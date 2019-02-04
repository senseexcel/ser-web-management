
import { Routes } from '@angular/router';
import { LicensePageComponent } from '../pages';

export const LicenseRoutes: Routes = [{
    path: 'license',
    component: LicensePageComponent,
    data: {
        breadcrumb: 'License'
    }
}];
