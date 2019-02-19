import { NgModule } from '@angular/core';
import { SmcUiModule } from '@smc/modules';
import { ItemListModule } from '@smc/modules/item-list/item-list.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { COMPONENTS, ENTRY_COMPONENTS, EXPORT_COMPONENTS } from './components';

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    entryComponents: [
        ...ENTRY_COMPONENTS
    ],
    exports: [
        ...EXPORT_COMPONENTS
    ],
    imports: [
        ScrollingModule,
        SmcUiModule,
        ItemListModule,
        ReactiveFormsModule
    ],
    providers: [
    ],
})
export class TemplateSelectionsModule { }
