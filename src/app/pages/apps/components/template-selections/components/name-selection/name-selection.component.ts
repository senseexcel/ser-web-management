import { Component, Inject, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ITEM_LIST_SOURCE, ITEM_LIST_MODE, ITEM_LIST_CONTROLLER } from '@smc/modules/item-list/provider/tokens';
import { ItemListController } from '@smc/modules/item-list/provider/item-list.controller';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { ISelection } from '../../api/selections.interface';
import { DIMENSION_SOURCE } from '../../provider/tokens';
import { skip } from 'rxjs/internal/operators/skip';

@Component({
    selector: 'smc-template-selections--name',
    templateUrl: 'name-selection.component.html',
    viewProviders: [
        { provide: ITEM_LIST_SOURCE, useExisting: DIMENSION_SOURCE },
        { provide: ITEM_LIST_MODE, useValue: ItemList.MODE.SINGLE },
        { provide: ITEM_LIST_CONTROLLER, useClass: ItemListController }
    ]
})
export class TemplateSelectionsNameComponent implements OnInit {

    @Input()
    public items = [];

    @Output()
    public changed: EventEmitter<ItemList.ChangedEvent> = new EventEmitter();

    constructor(
        @Inject(ITEM_LIST_CONTROLLER) private listController: ItemListController,
    ) { }

    ngOnInit() {
        this.listController.update$
            .pipe(skip(1))
            .subscribe((event: ItemList.ChangedEvent) => {
                this.changed.emit(event);
            });
    }

    /**
     * update value connector
     *
     * @private
     * @param {ISelection.Item} item
     * @memberof SelectionComponent
     */
    private updateValueConnector(item: ISelection.Item) {
        /*
        this.connector.disable(false);
        switch (item.type) {
            case ISelection.TYPE.DIMENSION:
                this.connector.config = {
                    selectFrom: {
                        type: ISelection.TYPE.DIMENSION,
                        value: item.id
                    }
                };
                break;
            case ISelection.TYPE.FIELD:
                this.connector.config = {
                    selectFrom: {
                        type: ISelection.TYPE.FIELD,
                        value: item.title
                    }
                };
                break;
            default:
                this.connector.disable(true);
        }
        */
    }
}
