import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownModule } from '@smc/modules/drop-down';
import { MaterialModule } from '@smc/modules/material.module';

import { ListHeaderComponent } from './components/list/list-header.component';
import { SmcPageComponent } from './components/page/page.component';
import { SmcUiButtonComponent } from './components/button/button.component';
import { SmcUiButtonNavbarComponent } from './components/button/navbar.component';

@NgModule({
    imports: [
        CommonModule,
        DropDownModule,
        MaterialModule
    ],
    exports: [
        ListHeaderComponent,
        SmcPageComponent,
        SmcUiButtonComponent,
        SmcUiButtonNavbarComponent,
    ],
    declarations: [
        ListHeaderComponent,
        SmcPageComponent,
        SmcUiButtonComponent,
        SmcUiButtonNavbarComponent,
    ],
    providers: [],
})
export class SmcUiModule { }
