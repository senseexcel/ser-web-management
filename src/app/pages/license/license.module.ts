import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ModalModule, MaterialModule, SmcUiModule } from '@smc/modules';
import { TranslateService } from '@ngx-translate/core';

import { SER_DATE_FORMATS } from './api/ser-date-formats';
import { components, InsertOverlayComponent, InsertOverlayFooterComponent } from './components';
import { LicenseRoutingModule } from './license-routing.module';
import { pages } from './pages';
import { services } from './services';
import { JsonpInterceptorModule } from './jsonp-interceptor.module';

// i18n
import i18n_en from './i18n/en.json';

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
        SmcUiModule
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
export class LicenseModule {
    public constructor(translate: TranslateService) {
        translate.setTranslation('en', i18n_en, true);
    }
}
