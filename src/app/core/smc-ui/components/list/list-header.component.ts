import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'smc-list--header',
    templateUrl: 'list-header.component.html',
    styleUrls: ['list-header.component.scss']
})
export class ListHeaderComponent {

    @Input()
    public selected: number;

    @Input()
    showing: number;

    @Input()
    total: number;

    @Output()
    public reload: EventEmitter<void> = new EventEmitter();

    @Output()
    public selectAll: EventEmitter<void> = new EventEmitter();

    @Output()
    public deselectAll: EventEmitter<void> = new EventEmitter();

    public doReload() {
        this.reload.emit();
    }

    public selectAllRows() {
        this.selectAll.emit();
    }

    public deselectAllRows() {
        this.deselectAll.emit();
    }
}
