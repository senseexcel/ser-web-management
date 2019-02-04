import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './model/routes';

@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes)
    ],
    exports: [RouterModule],
    providers: []
})
export class DashboardRoutingModule { }
