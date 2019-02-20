
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ITEM_LIST_CONTROLLER } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'smc-template-selections--name-view',
    templateUrl: 'name-selection-item.component.html',
    styleUrls: ['name-selection-item.component.scss']
})
export class TemplateSelectionNameViewComponent implements OnInit, OnDestroy {

    public item: ItemList.Item;

    private destroyed$: Subject<boolean>;

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) public controller: ItemListController
    ) {
        this.destroyed$ = new Subject();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
    }

    ngOnInit() {
        this.controller.update$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((changed: ItemList.ChangedEvent) => {
                if (changed.added.length) {
                    this.item = changed.added[0];
                    return;
                }
                this.item = null;
            });
    }
}
