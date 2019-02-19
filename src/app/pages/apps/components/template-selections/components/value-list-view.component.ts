import { Component, OnInit, Inject } from '@angular/core';
import { ITEM_LIST_CONTROLLER, ITEM_LIST_DATA } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';

@Component({
    selector: 'smc-template-selections--value-list',
    templateUrl: 'value-list-view.component.html',
    styleUrls: ['./value-list-view.component.scss']
})
export class TemplateSelectionValueListViewComponent implements OnInit {
    constructor(
        @Inject(ITEM_LIST_DATA) public items: ItemList.Item[],
        @Inject(ITEM_LIST_CONTROLLER) public controller
    ) { }

    ngOnInit() {}
}
