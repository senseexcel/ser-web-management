import { NgModule } from '@angular/core';
import { ContentManagerRoutingModule } from './content-manager.routing.module';
import { SmcUiModule, MaterialModule } from '@smc/modules';
import { ListComponent } from './components/list.component';
import { CommonModule } from '@angular/common';
import { PaginationModule } from '@smc/modules/smc-ui';
import { TranslateService } from '@ngx-translate/core';
// i18n
import i18n_en from './i18n/en.json';

@NgModule({
    declarations: [
        ListComponent
    ],
    entryComponents: [
        ListComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        ContentManagerRoutingModule,
        MaterialModule,
        PaginationModule,
        SmcUiModule,
    ],
    providers: [],
})
export class ContentManagerModule {

    constructor(translate: TranslateService) {
        translate.setTranslation('en', i18n_en, true);
    }
}
