import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';

@Injectable()
export class EditGuard implements CanActivate {

    constructor(
        private router: Router,
        private appManager: SerAppManagerService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        return true;

        if (this.appManager.getSelectedApps().length) {
            return true ;
        }

        /** no apps selected so we can edit nothing, redirect back to app list */
        this.router.navigate(['/apps/']);
        return false;
    }
}
