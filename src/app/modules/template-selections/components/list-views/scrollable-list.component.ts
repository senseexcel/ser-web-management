import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ITEM_LIST_CONTROLLER } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewportControl } from 'ngx-customscrollbar';

@Component({
    selector: 'smc-template-selections--scrollable-list',
    templateUrl: 'scrollable-list.component.html',
    styleUrls: ['./scrollable-list.component.scss'],
    viewProviders: [ViewportControl]
})
export class ScrollableListComponent implements OnInit, OnDestroy {

    public items: ItemList.Item[];

    private destroyed$: Subject<boolean>;

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) public controller: ItemListController
    ) {
        this.destroyed$ = new Subject();
    }

    public clearAll() {
        this.controller.removeAll();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
    }

    ngOnInit() {
        this.controller.update$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((changed: ItemList.ChangedEvent) => {
                this.items = changed.items;
            });
    }
}
