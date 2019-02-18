import { Component, OnInit, Input } from '@angular/core';
import { ITEM_LIST_SOURCE, ITEM_LIST_VIEW } from '@smc/modules/item-list/provider/tokens';
import { SelectionValueConnector } from '@smc/pages/apps/components/template-selections/provider/selection-value.connector';
import { TemplateSelectionValueListViewComponent } from './value-list-view.component';

@Component({
    selector: 'smc-template-selections--value',
    templateUrl: 'value-selection.component.html',
    providers: [
        {provide: ITEM_LIST_SOURCE, useClass: SelectionValueConnector},
        // {provide: ITEM_LIST_VIEW, useValue: TemplateSelectionValueListViewComponent}
    ]
})
export class TemplateSelectionValueComponent implements OnInit {

    @Input()
    public items = [];

    constructor() { }

    ngOnInit() { }
}
