import { Routes } from '@angular/router';
import { LogoutComponent } from '../components/logout/logout.component';

export const UserRoutes: Routes = [{
    path: 'user',
    children: [{
        path: 'logout',
        component: LogoutComponent,
        resolve: {
            url: 'externalUrlRedirectResolver'
        },
        data: {
            externalUrl: '/qps/logout'
        }
    }]
}];
