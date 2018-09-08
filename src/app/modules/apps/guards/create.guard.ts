import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';

@Injectable()
export class CreateGuard implements CanActivate {

    constructor(
        private router: Router,
        private appManager: SerAppManagerService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (true) {
            console.log('route: ', route, { queryParams: { returnUrl: state.url }});
            return true;
        }
        // not logged in so redirect to login page with the return url
//        this.router.navigate(['/apps/']);
        console.log('reload to apps: ', { queryParams: { returnUrl: state.url } });
        return false;
    }
}
