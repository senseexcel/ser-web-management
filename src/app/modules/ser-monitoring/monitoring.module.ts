import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@core/core.module';
import { LicenseModule } from '../ser-license/license.module';
import { components } from './components';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { pages } from './pages';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        LicenseModule,
        MonitoringRoutingModule
    ],
    declarations: [
        ...components,
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
