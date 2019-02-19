import { NgModule } from '@angular/core';
import { SmcUiModule } from '@smc/modules';
import { ItemListModule } from '@smc/modules/item-list/item-list.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateSelectionsNameComponent } from './components/name-selection.component';
import { TemplateSelectionValueComponent } from './components/value-selection.component';
import { TemplateSelectionValueListViewComponent } from './components/value-list-view.component';
import { TemplateSelectionComponent } from './components/selection.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
    declarations: [
        TemplateSelectionComponent,
        TemplateSelectionsNameComponent,
        TemplateSelectionValueComponent,
        TemplateSelectionValueListViewComponent
    ],
    entryComponents: [
        TemplateSelectionValueListViewComponent
    ],
    exports: [
        TemplateSelectionComponent,
    ],
    imports: [
        ScrollingModule,
        SmcUiModule,
        ItemListModule,
        ReactiveFormsModule
    ],
    providers: [
        TemplateSelectionValueListViewComponent
    ],
})
export class TemplateSelectionsModule { }
