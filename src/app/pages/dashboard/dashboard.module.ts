import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MenuModule, SmcCommonModule } from '@smc/modules';
import { DashboardComponent } from './components/dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MenuModule,
        SmcCommonModule
    ],
    exports: [],
    declarations: [DashboardComponent],
    providers: [],
})
export class DashboardModule { }
