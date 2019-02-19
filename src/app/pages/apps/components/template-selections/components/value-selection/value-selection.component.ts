import { Component, OnInit, Input, EventEmitter, Inject, Output, OnDestroy } from '@angular/core';
import { ITEM_LIST_SOURCE, ITEM_LIST_VIEW, ITEM_LIST_CONTROLLER } from '@smc/modules/item-list/provider/tokens';
import { TemplateSelectionValueListViewComponent } from './value-list-view.component';
import { VALUE_SOURCE } from '../../provider/tokens';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { skip, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'smc-template-selections--value',
    templateUrl: 'value-selection.component.html',
    viewProviders: [
        { provide: ITEM_LIST_CONTROLLER, useClass: ItemListController },
        { provide: ITEM_LIST_SOURCE, useExisting: VALUE_SOURCE },
        { provide: ITEM_LIST_VIEW, useValue: TemplateSelectionValueListViewComponent },
    ]
})
export class TemplateSelectionValueComponent implements OnInit, OnDestroy {

    @Input()
    public items = [];

    @Output()
    public changed: EventEmitter<ItemList.ChangedEvent> = new EventEmitter();

    private destroyed$: Subject<boolean>;

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) private listController: ItemListController,
    ) {
        this.destroyed$ = new Subject();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
    }

    ngOnInit() {
        /** only register for real changes, the first one is only a set */
        this.listController.update$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$)
            )
            .subscribe((event: ItemList.ChangedEvent) => {
                this.changed.emit(event);
            });
    }
}
