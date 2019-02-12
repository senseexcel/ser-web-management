import { NgModule, Injector, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownModule } from '@smc/modules/drop-down';
import { MaterialModule } from '@smc/modules/material.module';
import { SmcCommonModule } from '@smc/modules/smc-common';

import { ListHeaderComponent } from './components/list/list-header.component';
import { SmcPageComponent } from './components/page/page.component';
import { SmcUiButtonComponent } from './components/button/button.component';
import { SmcUiButtonNavbarComponent } from './components/button/navbar.component';
import { ItemListComponent } from './components';
import { MenuComponent } from './components/menu/menu.component';

// translation files
import i18n_en from './i18n/en.json';
import { TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        SmcCommonModule,
        DropDownModule,
        MaterialModule,
        RouterModule
    ],
    exports: [
        ListHeaderComponent,
        SmcPageComponent,
        SmcUiButtonComponent,
        SmcUiButtonNavbarComponent,
        ItemListComponent,
        MaterialModule,
        SmcCommonModule,
        MenuComponent
    ],
    declarations: [
        ListHeaderComponent,
        SmcPageComponent,
        SmcUiButtonComponent,
        SmcUiButtonNavbarComponent,
        ItemListComponent,
        MenuComponent
    ],
    providers: [
    ],
})
export class SmcUiModule {
    public constructor(private i18n: TranslateService) {
        this.i18n.setTranslation('en', i18n_en, true);
    }
}
