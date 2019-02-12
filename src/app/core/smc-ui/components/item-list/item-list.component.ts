import { Component, Output, EventEmitter, Input, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { RemoteSourceConnector } from '../../api/remote-source.connector';
import { EmptyRemoteSourceConnector } from '../../provider/empty-remote-source.connector';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
    selector: 'smc-ui--item-list',
    templateUrl: 'item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements AfterViewInit, OnDestroy {

    @Input()
    public remoteSource: RemoteSourceConnector = new EmptyRemoteSourceConnector();

    @Input()
    public items: string[] = new Array();

    @Output()
    public changed: EventEmitter<any>;

    @Output()
    public input: EventEmitter<string>;

    public source: any[];

    @ViewChild('inputField')
    private textField: ElementRef;

    private isDestroyed$: Subject<boolean>;

    constructor() {
        this.changed = new EventEmitter();
        this.input   = new EventEmitter();
        this.isDestroyed$ = new Subject();
    }

    /**
     * removed value from item list
     *
     * @param {number} itemIndex
     * @memberof ItemListComponent
     */
    public doRemove(itemIndex: number) {
        this.items.splice(itemIndex, 1);
    }

    /**
     * add value if user pressed enter
     *
     * @memberof ItemListComponent
     */
    public addValue() {
        this.items.push(this.textField.nativeElement.value);
        this.textField.nativeElement.value = '';
    }

    public onSelect(event: MatAutocompleteSelectedEvent) {
        this.items.push(event.option.value);
        this.textField.nativeElement.value = '';
    }

    /**
     * component gets destroyed
     *
     * @memberof ItemListComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
    }

    /**
     *
     *
     * @memberof SelectionListComponent
     */
    ngAfterViewInit() {

        fromEvent(this.textField.nativeElement, 'keydown').pipe(
            debounceTime(200),
            map(() => this.textField.nativeElement.value),
            distinctUntilChanged(),
            switchMap((value) => this.remoteSource.fetch(value)),
            takeUntil(this.isDestroyed$)
        ).subscribe((data: string[]) => {
            this.source = data;
        });
    }
}
