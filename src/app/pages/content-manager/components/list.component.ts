import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITableData } from '@smc/modules/qrs/api/table.interface';
import { SharedContentRepository } from '@smc/modules/qrs';
import { mergeMap, catchError, filter, distinctUntilChanged, tap, switchMap, takeWhile, takeUntil, skipWhile } from 'rxjs/operators';
import { of, Observable, fromEvent, merge, Subject } from 'rxjs';
import { IDataNode, SmcCache } from '@smc/modules/smc-common';
import { DataConverter } from '@smc/modules/qrs';
import { PaginationService } from '@smc/modules/smc-ui/pagination';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'smc-shared-content--list',
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
    viewProviders: [PaginationService]
})
export class ListComponent implements OnInit, OnDestroy {

    public columns: string[] = [];
    public tableData: IDataNode[];
    public isLoading = false;
    public total = 0;
    public visible: number;
    public selections: SelectionModel<IDataNode>;

    private listSettings: IDataNode;
    private ctrlKeyDown: boolean;
    private isDestroyed: Subject<boolean> = new Subject();

    constructor(
        private sharedContentRepository: SharedContentRepository,
        private pagination: PaginationService,
        private smcCache: SmcCache,
    ) {
        this.selections = new SelectionModel(true);

        try {
            this.listSettings = this.smcCache.get('smc.settings.list');
        } catch (error) {
            this.listSettings = { itemPageCount: 100 };
        }
    }

    /**
     * load initial table data
     *
     * @memberof ListComponent
     */
    ngOnInit() {
        this.initializePagination();
        this.loadSharedContentData();
        this.registerKeyEvents();
    }

    ngOnDestroy() {
        this.selections.clear();
        this.isDestroyed.next(true);
    }

    /**
     * shared content gets selected
     *
     * @param {IDataNode} content
     * @memberof ListComponent
     */
    public selectSharedContent(content: IDataNode) {
        if (this.ctrlKeyDown && this.selections.isSelected(content)) {
            this.selections.deselect(content);
            return;
        }
        if (!this.ctrlKeyDown) {
            this.selections.clear();
        }
        this.selections.select(content);
    }

    /**
     * delete shared content which has been selected
     *
     * @returns
     * @memberof ListComponent
     */
    public deleteSharedContent() {
        if (this.selections.isEmpty()) {
            return;
        }

        const contentToDelete = this.selections.selected.reduce<number[]>((idCollection, content) => {
            idCollection.push(content.Id);
            return idCollection;
        }, []);

        this.sharedContentRepository.delete(contentToDelete)
            .subscribe((success: boolean) => {
                /* on success all delete requests was successful
                 * if this was the last page and we removed all items on last page we have to go one page back
                 */
                if (success && this.visible === contentToDelete.length && this.pagination.isLastPage()) {
                    this.pagination.showPrevPage();
                    return;
                }

                // otherwise reload just content on current page
                this.loadSharedContentData((this.pagination.getCurrentPage() - 1) * this.listSettings.itemPageCount);
            });
    }

    public reloadList() {
        this.clearSelections();
        this.pagination.showPage(1);
    }

    public selectAll() {
        this.selections.select(...this.tableData);
    }

    public deselectAll() {
        this.selections.clear();
    }

    /**
     * clear all selections which has been made
     *
     * @private
     * @memberof ListComponent
     */
    private clearSelections() {
        this.selections.clear();
    }

    /**
     * initialize pagination
     *
     * @private
     * @memberof ListComponent
     */
    private initializePagination() {

        this.pagination.configure({
            itemPageCount: this.listSettings.itemPageCount,
            currentPage: 1
        });

        this.pagination.pageChange.subscribe((page: number) => {
            this.loadSharedContentData((page - 1) * this.listSettings.itemPageCount);
        });
    }

    /**
     * update shared content
     *
     * @private
     * @param {number} [start=0]
     * @memberof ListComponent
     */
    private loadSharedContentData(start = 0) {

        /** clear selections and update pagination */
        this.clearSelections();

        this.isLoading = true;
        this.sharedContentRepository.count()
            .pipe(
                mergeMap((count: number): Observable<ITableData> => {
                    if (count === 0) {
                        return of(null);
                    }
                    this.total = count;
                    return this.sharedContentRepository.fetchTable(start, this.listSettings.itemPageCount);
                }),
                catchError(() => of(null))
            ).subscribe((tableData: ITableData) => {
                /** update properties */
                this.columns = tableData.columnNames;
                this.tableData = DataConverter.convertQrsTableToJson(tableData);
                this.visible = this.tableData.length;

                this.pagination.update({
                    itemTotalCount: this.total
                });

                this.isLoading = false;
            });
    }

    /**
     * register keyboard events to get notified
     * if ctrl key has been pressed down for multi selection
     *
     * @private
     * @memberof ListComponent
     */
    private registerKeyEvents() {
        /** could be used as pipe / directive ? */
        fromEvent(document, 'keydown').pipe(
            filter((e: KeyboardEvent) => e.keyCode === 17 && !this.ctrlKeyDown),
            switchMap(() => {
                this.ctrlKeyDown = true;
                return fromEvent(document, 'keyup').pipe(
                    filter((e: KeyboardEvent) => e.keyCode === 17)
                );
            }),
            takeUntil(this.isDestroyed)
        ).subscribe(() => {
            this.ctrlKeyDown = false;
        });
    }
}
