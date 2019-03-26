import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'smc-ui--list-header',
    templateUrl: 'list-header.component.html',
    styleUrls: ['list-header.component.scss']
})
export class ListHeaderComponent {

    @Input()
    public selected = 0;

    @Input()
    showing = 0;

    @Input()
    total = 0;

    // tslint:disable-next-line:no-input-rename
    @Input('disableActions')
    disableMassActions: boolean;

    @Output()
    public reload: EventEmitter<void> = new EventEmitter();

    @Output()
    public selectAll: EventEmitter<void> = new EventEmitter();

    @Output()
    public deselectAll: EventEmitter<void> = new EventEmitter();

    @ViewChild('listDataCounts')
    private listDataCounts: ElementRef;

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
