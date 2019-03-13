import { NgModule, Injector, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownModule } from '@smc/modules/drop-down';
import { MaterialModule } from '@smc/modules/material.module';
import { SmcCommonModule } from '@smc/modules/smc-common';
import { NgxCustomScrollbarModule } from 'ngx-customscrollbar';

import { ListHeaderComponent } from './components/list/list-header.component';
import { SmcPageComponent } from './components/page/page.component';
import { SmcUiButtonComponent } from './components/button/button.component';
import { SmcUiButtonNavbarComponent } from './components/button/navbar.component';
import { MenuComponent } from './components/menu/menu.component';

// translation files
import i18n_en from './i18n/en.json';
import { TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SmcUiDefaultContentDirective } from './directives/default-content.directive';
import { SelectOnClickDirective } from './components/list/select-on-click.directive';

@NgModule({
    imports: [
        CommonModule,
        SmcCommonModule,
        DropDownModule,
        MaterialModule,
        RouterModule,
        NgxCustomScrollbarModule
    ],
    exports: [
        CommonModule,
        SmcCommonModule,
        ListHeaderComponent,
        SmcPageComponent,
        SmcUiButtonComponent,
        SmcUiButtonNavbarComponent,
        MaterialModule,
        SmcCommonModule,
        MenuComponent,
        SmcUiDefaultContentDirective,
        SelectOnClickDirective,
        NgxCustomScrollbarModule
    ],
    declarations: [
        ListHeaderComponent,
        SmcPageComponent,
        SmcUiButtonComponent,
        SmcUiButtonNavbarComponent,
        MenuComponent,
        SmcUiDefaultContentDirective,
        SelectOnClickDirective
    ],
    providers: [
    ],
})
export class SmcUiModule {
    public constructor(private i18n: TranslateService) {
        this.i18n.setTranslation('en', i18n_en, true);
    }
}
