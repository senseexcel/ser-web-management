import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SerAppManagerService } from '@core/ser-app/provider/ser-app-manager.service';


@Injectable()
export class EditGuard implements CanActivate {

    constructor(
        private router: Router,
        private appManager: SerAppManagerService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        if (this.appManager.getSelectedApps().length) {
            // ToDo Validate correct 
            console.log('Route is ok: ', { queryParams: { returnUrl: state.url } });
            // logged in so return true
            return true ; 
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/apps/']);
        console.log('reload to apps: ', { queryParams: { returnUrl: state.url } });
        return false;
    }
}