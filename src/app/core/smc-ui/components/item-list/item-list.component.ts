import { Component, Output, EventEmitter, Input, ViewChild, AfterViewInit, OnDestroy, ContentChild } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatInput, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { IDataNode } from '@smc/modules/smc-common';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, distinctUntilChanged, map, tap, catchError } from 'rxjs/operators';
import { RemoteSource, ItemList } from '../../api/item-list.interface';
import { EmptyRemoteSourceConnector } from '../../provider/empty-remote-source.connector';

@Component({
    selector: 'smc-ui--item-list',
    templateUrl: 'item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements AfterViewInit, OnDestroy {

    @Input()
    public remoteSource: RemoteSource.Connector<IDataNode> = new EmptyRemoteSourceConnector();

    @Input()
    public items: ItemList.Item[] = [];

    @Input()
    public label = '';

    /**
     * default mode multi, so multiple elements could added to list
     * if mode is set to single there could be only one item at the same time
     *
     * @type {ItemList.MODE}
     * @memberof ItemListComponent
     */
    @Input()
    public mode: ItemList.MODE = ItemList.MODE.MULTI;

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

    private isDestroyed$: Subject<boolean>;
    private keyDown$: Subject<string>;

    constructor() {
        this.changed = new EventEmitter();
        this.input   = new EventEmitter();
        this.isDestroyed$ = new Subject();
        this.keyDown$  = new Subject();
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
        this.changed.emit({added: [], removed});
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
     * select item via material select box
     *
     * @param {MatAutocompleteSelectedEvent} event
     * @memberof ItemListComponent
     */
    public onSelect(event: MatAutocompleteSelectedEvent) {
        this.addItem(event.option.value);
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
        this.input   = null;

        // delete
        this.items   = null;
        this.textField = null;
        this.remoteSource = null;
    }

    /**
     *
     *
     * @memberof SelectionListComponent
     */
    ngAfterViewInit() {
        this.registerKeyDownStream();
    }

    public onKeyDown($event: KeyboardEvent) {
        $event.stopPropagation();

        if ($event.keyCode !== 13) {
            this.keyDown$.next(this.textField.value);
        }
    }

    /**
     * on keydown on input field we submit the event
     * to an rxjs stream. After input wait for 200ms to fetch
     * data from remote sources, only if the user input value
     * has been changed.
     *
     * @private
     * @memberof ItemListComponent
     */
    private registerKeyDownStream() {
        this.keyDown$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
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

        this.changed.emit({added: [item], removed });
    }
}
