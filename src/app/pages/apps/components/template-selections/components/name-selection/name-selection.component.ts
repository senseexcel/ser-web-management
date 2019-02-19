import { Component, Inject, Input, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ITEM_LIST_SOURCE, ITEM_LIST_MODE, ITEM_LIST_CONTROLLER } from '@smc/modules/item-list/provider/tokens';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { DIMENSION_SOURCE } from '../../provider/tokens';
import { skip } from 'rxjs/internal/operators/skip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'smc-template-selections--name',
    templateUrl: 'name-selection.component.html',
    viewProviders: [
        { provide: ITEM_LIST_SOURCE, useExisting: DIMENSION_SOURCE },
        { provide: ITEM_LIST_MODE, useValue: ItemList.MODE.SINGLE },
        { provide: ITEM_LIST_CONTROLLER, useClass: ItemListController }
    ]
})
export class TemplateSelectionsNameComponent implements OnInit, OnDestroy {

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

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    ngOnInit() {
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
