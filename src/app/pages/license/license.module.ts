import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ModalModule, SmcCommonModule, MaterialModule } from '@smc/modules';

import { SER_DATE_FORMATS } from './api/ser-date-formats';
import { components, InsertOverlayComponent, InsertOverlayFooterComponent } from './components';
import { LicenseRoutingModule } from './license-routing.module';
import { pages } from './pages';
import { services } from './services';
import { JsonpInterceptorModule } from './jsonp-interceptor.module';

@NgModule({
    imports: [
        CommonModule,
        JsonpInterceptorModule,
        HttpClientModule,
        HttpClientJsonpModule,
        LicenseRoutingModule,
        ModalModule,
        ReactiveFormsModule,
        MaterialModule,
        SmcCommonModule
    ],
    declarations: [
        ...components,
        ...pages
    ],
    entryComponents: [
        ...pages,
        InsertOverlayComponent,
        InsertOverlayFooterComponent
    ],
    exports: [],
    providers: [
        ...services,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: SER_DATE_FORMATS},
    ]
})
export class LicenseModule {}
