import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SmcCommonModule, SmcUiModule } from '@smc/modules';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { services } from './services';
import { LicenseModule } from '../license/license.module';
import { pipes } from './pipes';
import { ENTRY_COMPONENTS, DECLARATION_COMPONENTS } from './components';

/** i18n */
import { TranslateService } from '@ngx-translate/core';
import i18n_en from './i18n/en.json';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LicenseModule,
        SmcCommonModule,
        SmcUiModule,
        MatProgressSpinnerModule,
        MonitoringRoutingModule,
        MatTableModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ...DECLARATION_COMPONENTS,
        ...pipes
    ],
    entryComponents: [
        ...ENTRY_COMPONENTS
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
