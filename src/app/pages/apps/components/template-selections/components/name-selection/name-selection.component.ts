import { Component, OnInit, Inject, Input } from '@angular/core';
import { ITEM_LIST_SOURCE, ITEM_LIST_MODE } from '@smc/modules/item-list/provider/tokens';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { switchMap, takeUntil } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { SelectionPropertyConnector } from '../../provider/selection-property.connector';
import { ISelection } from '../../api/selections.interface';
import { DIMENSION_SOURCE } from '../../provider/tokens';

@Component({
    selector: 'smc-template-selections--name',
    templateUrl: 'name-selection.component.html',
    viewProviders: [
        {provide: ITEM_LIST_SOURCE, useExisting: DIMENSION_SOURCE},
        {provide: ITEM_LIST_MODE, useValue: ItemList.MODE.SINGLE}
    ]
})
export class TemplateSelectionsNameComponent implements OnInit {

    @Input()
    public items = [];

    constructor(
        @Inject(ITEM_LIST_SOURCE) private connector: SelectionPropertyConnector
    ) {}

    ngOnInit() { }

    /**
     * dimension / field has been changed
     *
     * @param {ItemList.ChangedEvent} changedEvent
     * @memberof SelectionComponent
     */
    public selectionNameChanged(changedEvent: ItemList.ChangedEvent) {
        /*

        const added: ISelection.Item[] = changedEvent.added as ISelection.Item[];
        this.appValueConnector.disable(false);

        if (added.length) {
            this.updateValueConnector(added[0]);
        } else {
            this.appValueConnector.disable(true);
        }

        this.selectionName = changedEvent.items[0] ? changedEvent.items[0].title : '';
        */
    }

    /**
     * selection values has been changed
     *
     * @param {ItemList.ChangedEvent} changedEvent
     * @memberof SelectionComponent
     */
    public selectionValuesChanged(changedEvent: ItemList.ChangedEvent) {
        /*
        this.valueNames = changedEvent.items.reduce<string[]>((itemNames: string[], selectedItem: ItemList.Item) => {
            return [...itemNames, selectedItem.title];
        }, []);
        */
    }

    /**
     * register to app connector to get notified we have
     * create a connection to an app.
     *
     * @private
     * @memberof SelectionComponent
     */
    private registerAppConnector() {

        /*
        this.appConnector.connect
            .pipe(
                switchMap((app: EngineAPI.IApp) => {
                    this.connector.config = { app };
                    // this.appValueConnector.config = { app };

                    const needle = this.selectedDimension.length ? this.selectedDimension[0].title : null;
                    return forkJoin([
                        this.connector.findDimensionByName(needle),
                        this.connector.findFieldByName(needle)
                    ]);
                }),
                takeUntil(this.onDestroyed$)
            ).subscribe(([dimension, field]) => {
                this.updateValueConnector(dimension || field || { type: ISelection.TYPE.NONE, title: null });
            });

        this.appConnector.disconnect
            .pipe(takeUntil(this.onDestroyed$))
            .subscribe(() => {
                this.appDimensionConnector.close();
                this.appValueConnector.close();
            });
            */
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
