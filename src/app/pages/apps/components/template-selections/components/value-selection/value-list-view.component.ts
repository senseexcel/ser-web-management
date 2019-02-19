import { Component, OnInit, Inject } from '@angular/core';
import { ITEM_LIST_CONTROLLER } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';

@Component({
    selector: 'smc-template-selections--value-list',
    templateUrl: 'value-list-view.component.html',
    styleUrls: ['./value-list-view.component.scss']
})
export class TemplateSelectionValueListViewComponent implements OnInit {

    public items: ItemList.Item[];

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) public controller: ItemListController
    ) { }

    ngOnInit() {
        this.controller.update$.subscribe((changed: ItemList.ChangedEvent) => {
            this.items = changed.items;
        });
    }
}
