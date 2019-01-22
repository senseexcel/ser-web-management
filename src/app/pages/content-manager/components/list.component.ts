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

    private initializePagination() {

        this.pagination.configure({
            itemPageCount: this.listSettings.itemPageCount,
            currentPage: 1
        });

        this.pagination.pageChange.subscribe((page: number) => {
            this.loadSharedContentData((page - 1) * this.listSettings.itemPageCount);
        });
    }

    private loadSharedContentData(start = 0) {

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

                /** clear selections and update pagination */
                this.selections.clear();

                /** @todo should be repaint */
                this.pagination.update({
                    itemTotalCount: this.total
                });

                this.isLoading = false;
            });
    }
}
