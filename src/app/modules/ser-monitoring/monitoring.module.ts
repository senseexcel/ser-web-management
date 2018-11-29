import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@core/core.module';
import { LicenseModule } from '../ser-license/license.module';
import { components } from './components';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { pages } from './pages';
import { services } from './services';
import { MatTableModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        LicenseModule,
        MonitoringRoutingModule,
        MatTableModule
    ],
    declarations: [
        ...components,
        ...pages
    ],
    entryComponents: [
        ...pages
    ],
    providers: [
        ...services
    ]
})
export class MonitoringModule {}
