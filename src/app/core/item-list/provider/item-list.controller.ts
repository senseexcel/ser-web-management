import { ItemList } from '../api/item-list.interface';
import { Subject, BehaviorSubject } from 'rxjs';

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

        this.update$.next({
            added: items,
            removed: [],
            items: [...items]
        });
    }

    /**
     *
     *
     * @param {ItemList.Item[]} item
     * @memberof ItemListController
     */
    public add(item: ItemList.Item) {
        this.listItems.push(item);
        this.update$.next({
            added: [item],
            removed: [],
            items: [...this.listItems]
        });
    }

    /**
     * remove all items from list
     *
     * @memberof ItemListController
     */
    public removeAll() {
        this.update$.next({
            added: [],
            removed: this.listItems.splice(0, -1),
            items: []
        });
        this.listItems = [];
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

        this.update$.next({
            added: [],
            removed,
            items: [...this.listItems]
        });
    }
}
