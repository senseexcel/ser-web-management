import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { components } from './components';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { pages } from './pages';
import { services } from './services';
import { LicenseModule } from '../license/license.module';

@NgModule({
    imports: [
        CommonModule,
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
