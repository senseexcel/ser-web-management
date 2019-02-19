import { Component, OnInit, Inject } from '@angular/core';
import { ITEM_LIST_CONTROLLER } from '../../provider/tokens';
import { ItemList } from '../../api/item-list.interface';
import { ItemListController } from '../../provider/item-list.controller';

@Component({
    selector: 'smc-item-list--button-view',
    templateUrl: 'button-view.component.html'
})
export class ButtonListComponent implements OnInit {

    public items: ItemList.Item[];

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) public controller: ItemListController
    ) { }

    ngOnInit() {
        this.controller.update$.subscribe((update: ItemList.ChangedEvent) => {
            this.items = update.items;
        });
    }
}
