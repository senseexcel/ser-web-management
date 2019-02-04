import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LicenseRoutes } from './model/routes';

@NgModule({
    imports: [
        RouterModule.forChild(LicenseRoutes)
    ],
    exports: [RouterModule],
    providers: [],
})
export class LicenseRoutingModule { }
