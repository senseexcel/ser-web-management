import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'smc-list--header',
    templateUrl: 'list-header.component.html',
    styleUrls: ['list-header.component.scss']
})

export class ListHeaderComponent implements OnInit {

    @Input()
    public selected: number;

    /**
     * currently showing items
     *
     * @type {number}
     * @memberof IListData
     */
    @Input()
    showing: number;

    /**
     * total items
     *
     * @type {number}
     * @memberof IListData
     */
    @Input()
    total: number;

    /**
     * emits on reload button pressed
     *
     * @type {EventEmitter<void>}
     * @memberof ListHeaderComponent
     */
    @Output()
    public reload: EventEmitter<void>;

    public constructor() {
        this.reload = new EventEmitter();
    }

    ngOnInit() {
    }

    public doReload() {
        this.reload.emit();
    }
}
