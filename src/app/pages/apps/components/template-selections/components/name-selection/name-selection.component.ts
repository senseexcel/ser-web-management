import { Component, Inject, Input, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ITEM_LIST_SOURCE, ITEM_LIST_MODE, ITEM_LIST_CONTROLLER } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { skip } from 'rxjs/internal/operators/skip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DIMENSION_SOURCE } from '../../provider/tokens';
import { SelectionListController } from '../../provider/selection-list.controllter';

@Component({
    selector: 'smc-template-selections--name',
    templateUrl: 'name-selection.component.html',
    viewProviders: [
        { provide: ITEM_LIST_SOURCE, useExisting: DIMENSION_SOURCE },
        { provide: ITEM_LIST_MODE, useValue: ItemList.MODE.SINGLE },
        { provide: ITEM_LIST_CONTROLLER, useClass: SelectionListController }
    ]
})
export class TemplateSelectionsNameComponent implements OnInit, OnDestroy {

    @Input()
    public items = [];

    @Output()
    public changed: EventEmitter<ItemList.ChangedEvent> = new EventEmitter();

    private destroyed$: Subject<boolean>;

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) private listController: SelectionListController,
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
