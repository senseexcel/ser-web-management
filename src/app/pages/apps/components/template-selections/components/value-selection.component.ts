import { Component, OnInit, Input } from '@angular/core';
import { ITEM_LIST_SOURCE, ITEM_LIST_VIEW } from '@smc/modules/item-list/provider/tokens';
import { TemplateSelectionValueListViewComponent } from './value-list-view.component';
import { VALUE_SOURCE } from '../provider/tokens';

@Component({
    selector: 'smc-template-selections--value',
    templateUrl: 'value-selection.component.html',
    providers: [
        { provide: ITEM_LIST_SOURCE, useExisting: VALUE_SOURCE },
        { provide: ITEM_LIST_VIEW, useValue: TemplateSelectionValueListViewComponent }
    ]
})
export class TemplateSelectionValueComponent implements OnInit {

    @Input()
    public items = [];

    constructor() { }

    ngOnInit() { }

    public selectionValuesChanged($event) {
    }
}
