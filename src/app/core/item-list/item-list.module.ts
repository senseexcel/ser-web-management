import { NgModule } from '@angular/core';
import { ItemListComponent } from './components/item-list.component';
import { ButtonListComponent } from './components/view/button-view.component';
import { SmcUiModule } from '../smc-ui/ui.module';
import { ItemListViewComponent } from './components/item-list-view.component';

@NgModule({
    imports: [SmcUiModule],
    exports: [
        ItemListComponent
    ],
    declarations: [
        ButtonListComponent,
        ItemListComponent,
        ItemListViewComponent
    ],
    providers: [],
    entryComponents: [ButtonListComponent]
})
export class ItemListModule {
}
