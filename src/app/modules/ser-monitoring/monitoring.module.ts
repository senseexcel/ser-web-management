import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pages } from './pages';
import { LicenseModule } from '../ser-license/license.module';
import { MonitoringRoutingModule } from './monitoring-routing.module';

@NgModule({
    imports: [
        CommonModule,
        LicenseModule,
        MonitoringRoutingModule
    ],
    declarations: [
        ...pages
    ],
    entryComponents: [
        ...pages
    ],
    exports: [
    ],
    providers: [
    ]
})
export class MonitoringModule {}
