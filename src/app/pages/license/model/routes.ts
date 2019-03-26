
import { Routes } from '@angular/router';
import { LicensePageComponent, LicenseErrorPageComponent } from '../components';
import { LicensePreinstallGuard } from '../guard/preinstall.guard';

export const LicenseRoutes: Routes = [{
    path: 'license',
    component: LicensePageComponent,
    data: {
        breadcrumb: 'License'
    },
    canActivate: [LicensePreinstallGuard],
}, {
    path: 'license/error',
    component: LicenseErrorPageComponent,
    data: {
        breadcrumb: 'License'
    }
}];
