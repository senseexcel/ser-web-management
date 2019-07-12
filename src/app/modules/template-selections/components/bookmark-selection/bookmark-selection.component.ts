import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { ITEM_LIST_CONTROLLER, ITEM_LIST_MODE, ITEM_LIST_SOURCE, ITEM_LIST_VIEW } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { skip, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { SelectionListController } from '../../provider/selection-list.controllter';
import { AppConnector } from '@smc/modules/smc-common';
import { BookmarkSource } from '../../provider/bookmark.source';
import { ISerSenseSelection } from 'ser.api';
import { SingleItemComponent } from '../list-views/single-item.component';

@Component({
    selector: 'smc-template-selections--bookmark',
    templateUrl: 'bookmark-selection.component.html',
    viewProviders: [
        { provide: ITEM_LIST_CONTROLLER, useClass: SelectionListController },
        { provide: ITEM_LIST_SOURCE, useClass: BookmarkSource },
        { provide: ITEM_LIST_MODE, useValue: ItemList.MODE.SINGLE },
        { provide: ITEM_LIST_VIEW, useValue: SingleItemComponent },
    ]
})
export class TemplateSelectionBookmarkComponent implements OnInit, OnDestroy {

    @Input()
    public selection: ISerSenseSelection;

    public selectedBookmark: ItemList.Item[] = [];

    private destroyed$: Subject<boolean>;

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) private listController: ItemListController,
        @Inject(ITEM_LIST_SOURCE) private bookmarkSource: BookmarkSource,
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

        /** @todo fix bug name could be null */
        this.selection.name = undefined;

        if (this.selection.values.length > 0) {
            this.selectedBookmark = [{title: this.selection.values[0]}];
        }
    }

    /**
     * register to app connector events
     *
     * @private
     * @memberof TemplateSelectionBookmarkComponent
     */
    private registerAppConnectorEvents() {
        this.connector.connect
            .pipe(takeUntil(this.destroyed$))
            .subscribe((app: EngineAPI.IApp) => {
                this.bookmarkSource.config = { app };
            });

        this.connector.disconnect
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.bookmarkSource.close();
            });
    }

    /**
     * register to list controller events
     *
     * @private
     * @memberof TemplateSelectionBookmarkComponent
     */
    private registerListcontrollerEvents() {
        /** only register for real changes, the first one is only a set */
        this.listController.update$
            .pipe(
                skip(1),
                takeUntil(this.destroyed$)
            )
            .subscribe((event: ItemList.ChangedEvent) => {
                this.selection.values = [...event.items.map((item) => item.title)];
            });
    }
}
