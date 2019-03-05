import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { components } from './components';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { pages } from './pages';
import { services } from './services';
import { LicenseModule } from '../license/license.module';
import { SmcCommonModule } from '@smc/modules';
import { pipes } from './pipes';
import { TranslateService } from '@ngx-translate/core';

import i18n_en from './i18n/en.json';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LicenseModule,
        SmcCommonModule,
        MatProgressSpinnerModule,
        MonitoringRoutingModule,
        MatTableModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ...components,
        ...pages,
        ...pipes
    ],
    entryComponents: [
        ...pages
    ],
    providers: [
        ...services
    ]
})
export class MonitoringModule {

    public constructor(translate: TranslateService) {
        translate.setTranslation('en', i18n_en, true);
    }
}
