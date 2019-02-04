import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MenuModule, SmcUiModule } from '@smc/modules';
import { DashboardComponent } from './components/dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MenuModule,
        SmcUiModule
    ],
    exports: [],
    declarations: [DashboardComponent],
    providers: [],
})
export class DashboardModule { }
