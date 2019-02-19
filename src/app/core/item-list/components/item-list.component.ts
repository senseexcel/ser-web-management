import { Component, Output, EventEmitter, Input, ViewChild, AfterViewInit, OnDestroy, OnInit, Inject, Optional, Self } from '@angular/core';
import { MatInput, MatAutocompleteTrigger } from '@angular/material';
import { IDataNode } from '@smc/modules/smc-common';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { RemoteSource, ItemList } from '../api/item-list.interface';
import { ITEM_LIST_SOURCE, ITEM_LIST_MODE, ITEM_LIST_CONTROLLER } from '../provider/tokens';
import { EmptyRemoteSourceConnector } from '../provider/empty-remote-source.connector';
import { ItemListController } from '../provider/item-list.controller';

@Component({
    selector: 'smc-ui--item-list',
    templateUrl: 'item-list.component.html',
    styleUrls: ['./item-list.component.scss'],
    providers: [{provide: ITEM_LIST_CONTROLLER, useClass: ItemListController}]
})
export class ItemListComponent implements AfterViewInit, OnDestroy, OnInit {

    public itemSize = 0;

    @Input()
    public set items(items: ItemList.Item[]) {
        this.controller.items = items;
    }

    @Input()
    public label = '';

    @Output()
    public changed: EventEmitter<ItemList.ChangedEvent>;

    @Output()
    public input: EventEmitter<string>;

    public isGrouped: boolean;

    public source = [];

    @ViewChild(MatInput)
    private textField: MatInput;

    @ViewChild(MatAutocompleteTrigger)
    private autoCompleteTrigger: MatAutocompleteTrigger;

    private mode: ItemList.MODE;
    private remoteSource: RemoteSource.Connector<IDataNode> | EmptyRemoteSourceConnector;
    private isDestroyed$: Subject<boolean>;
    private remoteSource$: Subject<string>;

    constructor(
        @Inject(ITEM_LIST_SOURCE) @Optional() remoteSource: RemoteSource.Connector<IDataNode>,
        @Inject(ITEM_LIST_MODE) @Optional() mode: ItemList.MODE,
        @Inject(ITEM_LIST_CONTROLLER) @Self() private controller: ItemListController,
    ) {
        this.remoteSource = remoteSource || new EmptyRemoteSourceConnector();
        this.mode         = mode || ItemList.MODE.MULTI;

        this.changed = new EventEmitter();
        this.input = new EventEmitter();
        this.isDestroyed$ = new Subject();
        this.remoteSource$ = new Subject();
    }

    /**
     * add value if user pressed enter
     *
     * @memberof ItemListComponent
     */
    public addValue() {
        /** dont add empty values */
        if (this.textField.value === '') {
            return;
        }
        const newItem: ItemList.Item = { title: this.textField.value };
        this.addItem(newItem);
    }

    /**
     * component gets destroyed
     *
     * @memberof ItemListComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);

        // delete events
        this.changed = null;
        this.input = null;

        // delete
        this.items = null;
        this.textField = null;
        this.remoteSource = null;
    }

    /**
     * componente gets initialized, register
     * remoteSource stream to handle change event
     *
     * @memberof ItemListComponent
     */
    ngOnInit(): void {
        this.registerKeyDownStream();
        this.controller.update$.subscribe((changed: ItemList.ChangedEvent) => {
            this.itemSize = changed.items.length;
        });
    }

    /**
     * override onChange method of angular matrial autoComplete
     * but this will even trigger if we select an item from autocomplete
     * list
     *
     * @memberof SelectionListComponent
     */
    ngAfterViewInit() {
        this.autoCompleteTrigger.registerOnChange((value: string | ItemList.Item): null => {
            if (typeof value === 'string') {
                this.remoteSource$.next(value as string);
                return null;
            }
            this.addItem(value as ItemList.Item);
            return null;
        });
    }

    /**
     * register stream to fetch data from remote source
     *
     * @private
     * @memberof ItemListComponent
     */
    private registerKeyDownStream() {
        this.remoteSource$.pipe(
            debounceTime(100),
            switchMap((value) => this.remoteSource.fetch(value)),
            takeUntil(this.isDestroyed$)
        ).subscribe((source: RemoteSource.Source) => {
            this.isGrouped = false;
            if (source.type === RemoteSource.SourceType.GROUP) {
                this.isGrouped = true;
            }
            this.source = source.data;
        });
    }

    /**
     * add new item, on single mode remove last
     * item was added on item list
     *
     * @private
     * @emits ChangedEvent
     * @param {ItemList.Item} item
     * @memberof ItemListComponent
     */
    private addItem(item: ItemList.Item) {

        if (this.mode === ItemList.MODE.MULTI) {
            this.controller.add(item);
        } else {
            this.controller.items = [item];
        }

        /** we need to hide panel, if we dont select an item and just press enter
         * panel overlay still exists and block all events
         */
        this.autoCompleteTrigger.closePanel();

        /** clear sources */
        this.textField.value = '';
        this.source = [];
    }
}
