import { Component, Output, EventEmitter, Input, ViewChild, AfterViewInit, OnDestroy, OnInit, Inject, Optional } from '@angular/core';
import { MatInput, MatAutocompleteTrigger } from '@angular/material';
import { IDataNode } from '@smc/modules/smc-common';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { RemoteSource, ItemList } from '../api/item-list.interface';
import { ITEM_LIST_SOURCE, ITEM_LIST_MODE, ITEM_LIST_VIEW } from '../provider/tokens';
import { EmptyRemoteSourceConnector } from '../provider/empty-remote-source.connector';

@Component({
    selector: 'smc-ui--item-list',
    templateUrl: 'item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements AfterViewInit, OnDestroy, OnInit {

    @Input()
    public items: ItemList.Item[] = [];

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
    ) {

        this.remoteSource = remoteSource || new EmptyRemoteSourceConnector();
        this.mode         = mode || ItemList.MODE.MULTI;

        this.changed = new EventEmitter();
        this.input = new EventEmitter();
        this.isDestroyed$ = new Subject();
        this.remoteSource$ = new Subject();
    }

    /**
     * removed value from item list
     *
     * @emits ChangedEvent
     * @param {number} itemIndex
     * @memberof ItemListComponent
     */
    public doRemove(itemIndex: number) {
        const removed = this.items.splice(itemIndex, 1);
        this.changed.emit({
            added: [],
            removed,
            items: [
                ...this.items
            ]
        });
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
    }

    /**
     * override onChange method of angular matrial autoComplete
     * but this will even trigger if we select an item from autocomplete
     * list
     *
     * @memberof SelectionListComponent
     */
    ngAfterViewInit() {
        console.log(this.mode);
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
     * remove all items at once
     *
     * @memberof ItemListComponent
     */
    public clearItems() {
        const removed = this.items.slice();
        this.changed.emit({
            added: [],
            removed,
            items: []
        });
        this.items = [];
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
        let removed: ItemList.Item[] = [];

        if (this.mode === ItemList.MODE.MULTI) {
            this.items.push(item);
        } else {
            removed = this.items.splice(0, 1, item);
        }

        /** we need to hide panel, if we dont select an item and just press enter
         * panel overlay still exists and block all events
         */
        this.autoCompleteTrigger.closePanel();

        /** clear sources */
        this.textField.value = '';
        this.source = [];

        this.changed.emit({
            added: [item],
            removed,
            items: [...this.items]
        });
    }
}
