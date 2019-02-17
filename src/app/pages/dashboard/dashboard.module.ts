import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmcUiModule } from '@smc/modules';
import { DashboardComponent } from './components/dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { TranslateService } from '@ngx-translate/core';
import i18n_en from './i18n/en.json';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SmcUiModule
    ],
    exports: [],
    declarations: [DashboardComponent],
    providers: [],
})
export class DashboardModule {
    public constructor(i18n: TranslateService) {
        i18n.setTranslation('en', i18n_en, true);
    }
}
