import { NgModule } from '@angular/core';
import { ListHeaderComponent } from './components/list/list-header.component';
import { SmcPageComponent } from './components/page/page.component';
import { CommonModule } from '@angular/common';
import { DropDownModule, MaterialModule } from '@smc/modules';

@NgModule({
    imports: [
        CommonModule,
        DropDownModule,
        MaterialModule
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
