import { Component, OnInit, Input, EventEmitter, Inject, Output, OnDestroy } from '@angular/core';
import { ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { takeUntil, filter, switchMap } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { AppConnector } from '@smc/modules/smc-common';
import { DIMENSION_SOURCE, VALUE_SOURCE } from '../../provider/tokens';
import { DimensionFieldSource } from '../../provider/dimension-field.source';
import { ValueSource } from '../../provider/value.source';
import { ISelection } from '../../api/selections.interface';
import { ISerSenseSelection } from 'ser.api';

@Component({
    selector: 'smc-template-selections--field',
    templateUrl: 'field-selection.component.html',
    providers: [
        { provide: DIMENSION_SOURCE, useClass: DimensionFieldSource },
        { provide: VALUE_SOURCE, useClass: ValueSource }
    ]
})
export class TemplateSelectionFieldComponent implements OnInit, OnDestroy {

    @Input()
    public selection: ISerSenseSelection;

    @Output()
    public changed: EventEmitter<ItemList.ChangedEvent> = new EventEmitter();

    public selectedDimension: { title: string; }[];
    public selectedValues: ItemList.Item[];
    private destroyed$: Subject<boolean>;

    constructor(
        @Inject(DIMENSION_SOURCE) private dimensionSource: DimensionFieldSource,
        @Inject(VALUE_SOURCE) private valueSource: ValueSource,
        private connector: AppConnector,
    ) {
        this.destroyed$ = new Subject();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);

        this.valueSource.close();
        this.dimensionSource.close();
    }

    ngOnInit() {
        const selection = this.selection || { values: [], name: '' };
        this.selectedDimension = selection.name && selection.name.length ? [{ title: selection.name }] : [];
        this.selectedValues = selection.values.map<ItemList.Item>((title) => {
            return {
                title
            };
        });

        this.registerAppConnectorEvents();
    }

    /**
     * dimension value has been changed
     *
     * @param {ItemList.ChangedEvent} event
     * @returns
     * @memberof TemplateSelectionFieldComponent
     */
    public dimensionChanged(event: ItemList.ChangedEvent) {
        if (event.added.length) {
            this.updateValueConnector(event.added[0] as ISelection.Item);
            this.selection.name = event.added[0].title;
            return;
        }
        this.selection.name = null;
        this.valueSource.disable(true);
    }

    /**
     * Value has been added
     *
     * @param {ItemList.ChangedEvent} event
     * @memberof TemplateSelectionFieldComponent
     */
    public valueChanged(event: ItemList.ChangedEvent) {
        this.selection.values = event.items.map((item: ItemList.Item) => {
            return item.title;
        });
    }

    /**
     * register to app connector events
     *
     * @private
     * @memberof TemplateSelectionBookmarkComponent
     */
    private registerAppConnectorEvents() {

        this.connector.connect.pipe(
            filter(() => this.connector.hasConnection()),
            switchMap((app: EngineAPI.IApp) => {
                this.dimensionSource.config = { app };
                this.valueSource.config = { app };
                const needle = this.selectedDimension.length ? this.selectedDimension[0].title : null;
                return forkJoin([
                    this.dimensionSource.findDimensionByName(needle),
                    this.dimensionSource.findFieldByName(needle)
                ]);
            }),
            takeUntil(this.destroyed$)
        ).subscribe(([dimension, field]) => {
            this.updateValueConnector(dimension || field || { type: ISelection.TYPE.NONE, title: null });
        });

        this.connector.disconnect
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.valueSource.close();
                this.dimensionSource.close();
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
        this.valueSource.disable(false);
        switch (item.type) {
            case ISelection.TYPE.DIMENSION:
                this.valueSource.config = {
                    selectFrom: {
                        type: ISelection.TYPE.DIMENSION,
                        value: item.id
                    }
                };
                break;
            case ISelection.TYPE.FIELD:
                this.valueSource.config = {
                    selectFrom: {
                        type: ISelection.TYPE.FIELD,
                        value: item.title
                    }
                };
                break;
            default:
                this.valueSource.disable(true);
        }
    }
}
