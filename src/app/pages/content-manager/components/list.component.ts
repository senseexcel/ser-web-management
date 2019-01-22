import { Component, OnInit, ElementRef } from '@angular/core';
import { ITableData } from '@smc/modules/qrs/api/table.interface';
import { SharedContentRepository } from '@smc/modules/qrs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
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
export class ListComponent implements OnInit {

    public columns: string[] = [];
    public tableData: IDataNode[];
    public isLoading = false;
    public totalSelected = 0;
    public total = 0;
    public visible: number;
    public selections: SelectionModel<IDataNode>;

    private listSettings: IDataNode;

    constructor(
        private sharedContentRepository: SharedContentRepository,
        private pagination: PaginationService,
        private smcCache: SmcCache,
    ) {
        this.selections = new SelectionModel();

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

        this.selections.changed.subscribe(() => {
            this.totalSelected = 1;
        });
    }

    /**
     * shared content gets selected
     *
     * @param {IDataNode} content
     * @memberof ListComponent
     */
    public selectSharedContent(content: IDataNode) {
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

    public reloadSharedContent() {
        this.clearSelections();
        this.pagination.showPage(1);
    }

    /**
     * clear all selections which has been made
     *
     * @private
     * @memberof ListComponent
     */
    private clearSelections() {
        this.selections.clear();
        this.totalSelected = 0;
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
}
