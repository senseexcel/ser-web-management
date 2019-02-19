import { ItemList } from '../api/item-list.interface';
import { BehaviorSubject } from 'rxjs';

export class ItemListController {

    private listItems: ItemList.Item[];

    public update$: BehaviorSubject<ItemList.ChangedEvent>;

    public constructor() {
        this.update$ = new BehaviorSubject({
            added: [],
            removed: [],
            items: []
        });
    }

    public set items(items: ItemList.Item[]) {
        this.listItems = items;
        this.update(items);
    }

    /**
     *
     *
     * @param {ItemList.Item[]} item
     * @memberof ItemListController
     */
    public add(item: ItemList.Item) {
        this.listItems.push(item);
        this.update([item]);
    }

    /**
     * remove all items from list
     *
     * @memberof ItemListController
     */
    public removeAll() {
        this.listItems = [];
        this.update();
    }

    /**
     * remove item from list
     *
     * @param {ItemList.Item} item
     * @memberof ItemListController
     */
    public remove(item: ItemList.Item) {
        const index = this.listItems.indexOf(item);
        let removed: ItemList.Item[];
        if (index > -1) {
            removed = this.listItems.splice(index, 1);
        }
        this.update([], removed);

    }

    private update(added = [], removed = []) {
        this.update$.next({added, removed, items: [...this.listItems]});
    }
}
