import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { LicenseModule } from '../ser-license/license.module';
import { components } from './components';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { pages } from './pages';
import { services } from './services';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        LicenseModule,
        MatProgressSpinnerModule,
        MonitoringRoutingModule,
        MatTableModule,
        ReactiveFormsModule,
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
