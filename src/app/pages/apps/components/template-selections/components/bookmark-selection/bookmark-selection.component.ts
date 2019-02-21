import { Component, OnInit, Input, EventEmitter, Inject, Output, OnDestroy } from '@angular/core';
import { ITEM_LIST_CONTROLLER, ITEM_LIST_MODE, ITEM_LIST_SOURCE } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { skip, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { SelectionListController } from '../../provider/selection-list.controllter';
import { AppConnector } from '@smc/modules/smc-common';
import { SelectionBookmarkConnector } from '../../provider/selection-bookmark.connector';

@Component({
    selector: 'smc-template-selections--bookmark',
    templateUrl: 'bookmark-selection.component.html',
    viewProviders: [
        { provide: ITEM_LIST_CONTROLLER, useClass: SelectionListController},
        { provide: ITEM_LIST_SOURCE, useClass: SelectionBookmarkConnector },
        { provide: ITEM_LIST_MODE, useValue: ItemList.MODE.SINGLE },
    ]
})
export class TemplateSelectionBookmarkComponent implements OnInit, OnDestroy {

    @Input()
    public items = [];

    @Output()
    public changed: EventEmitter<ItemList.ChangedEvent> = new EventEmitter();

    private destroyed$: Subject<boolean>;

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) private listController: ItemListController,
        @Inject(ITEM_LIST_SOURCE) private bookmarkSource: SelectionBookmarkConnector,
        private connector: AppConnector,
    ) {
        this.destroyed$ = new Subject();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.bookmarkSource.close();
    }

    ngOnInit() {
        this.registerAppConnectorEvents();
        this.registerListcontrollerEvents();
    }

    private registerAppConnectorEvents() {
        this.connector.connect
            .pipe(takeUntil(this.destroyed$))
            .subscribe((app: EngineAPI.IApp) => {
            this.bookmarkSource.config = {app};
        });

        this.connector.disconnect
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
            this.bookmarkSource.close();
        });
    }

    private registerListcontrollerEvents() {
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
