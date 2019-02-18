import { Component, OnInit, Inject } from '@angular/core';
import { ITEM_LIST_DATA, ITEM_LIST_CONTROLLER } from '../../provider/tokens';
import { ItemList } from '../../api/item-list.interface';

@Component({
    selector: 'smc-item-list--button-view',
    templateUrl: 'button-view.component.html'
})
export class ButtonListComponent implements OnInit {

    constructor(
        @Inject(ITEM_LIST_DATA) public items: ItemList.Item[],
        @Inject(ITEM_LIST_CONTROLLER) public controller
    ) { }

    ngOnInit() { }
}
