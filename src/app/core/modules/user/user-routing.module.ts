import { NgModule } from '@angular/core';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRoutes } from './model/routes';

@NgModule({
    imports: [
        RouterModule.forChild(UserRoutes)
    ],
    exports: [RouterModule],
    providers: [{
        provide: 'externalUrlRedirectResolver',
        useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            window.location.href = (route.data as any).externalUrl;
        }
    }],
})
export class UserRoutingModule { }
