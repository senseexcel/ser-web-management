import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonitoringRoutes } from './model/routes';

@NgModule({
    imports: [
        RouterModule.forChild(MonitoringRoutes)
    ],
    exports: [RouterModule],
    providers: [],
})
export class MonitoringRoutingModule { }
