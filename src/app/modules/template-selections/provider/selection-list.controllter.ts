import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';

export class SelectionListController extends ItemListController {

    /**
     * @inheritdoc
     * @param {ItemList.Item} item
     * @memberof SelectionListController
     */
    public add(newItem: ItemList.Item) {
        // we need to check item is allready in list
        const inList = this.listItems.some((item) => item.title === newItem.title);

        if (!inList) {
            super.add(newItem);
        }
    }
}
