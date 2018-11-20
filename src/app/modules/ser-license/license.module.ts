import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatTableModule, MatDatepickerModule, MatInputModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MatAutocompleteModule } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CoreModule } from '@core/core.module';
import { ModalModule } from '@core/modules/modal/modal.module';

import { SER_DATE_FORMATS } from './api/ser-date-formats';
import { components, InsertOverlayComponent, InsertOverlayFooterComponent } from './components';
import { LicenseRoutingModule } from './license-routing.module';
import { pages } from './pages';
import { services } from './services';
import { JsonpInterceptorModule } from './jsonp-interceptor.module';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        JsonpInterceptorModule,
        HttpClientModule,
        HttpClientJsonpModule,
        LicenseRoutingModule,
        MatTableModule,
        MatInputModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        ModalModule,
        ReactiveFormsModule,
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
