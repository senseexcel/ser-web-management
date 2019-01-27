import { NgModule } from '@angular/core';
import { ListHeaderComponent } from './components/list/list-header.component';
import { SmcPageComponent } from './components/page/page.component';
import { CommonModule } from '@angular/common';
import { DropDownModule } from '@smc/modules/drop-down';

@NgModule({
    imports: [
        CommonModule,
        DropDownModule
    ],
    exports: [
        ListHeaderComponent,
        SmcPageComponent,
    ],
    declarations: [
        ListHeaderComponent,
        SmcPageComponent,
    ],
    providers: [],
})
export class SmcUiModule { }
