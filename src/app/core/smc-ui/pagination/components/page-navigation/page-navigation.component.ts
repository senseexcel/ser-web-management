import { Component, Host, OnInit } from '@angular/core';
import { PaginationService } from '../../providers/pagination.service';
import { IPageData } from '../../api';

interface PageItem {
    content: string | number;
    canActivate: boolean;
    isActive: boolean;
}

@Component({
    selector: 'smc-pagination--navigation',
    templateUrl: 'page-navigation.component.html',
    styleUrls: ['page-navigation.component.scss']
})
export class PageNavigationComponent implements OnInit {

    public pageItems: PageItem[];

    public pageCount: number;

    private pagination: PaginationService;

    constructor( @Host() pagination: PaginationService) {
        this.pagination = pagination;
        this.pageItems = [];
    }

    public ngOnInit() {

        /** page will be updated */
        this.pagination.pageUpdate
            .subscribe((pageData: IPageData) => {
                this.pageCount = pageData.getPageCount();
                this.createPaginationItems(pageData);
            });
    }

    /**
     *
     * @param {number} page
     */
    public setPage(page: number) {
        this.pagination.showPage(page);
    }

    public goNextPage() {
        this.setPage( this.pagination.getCurrentPage() + 1);
    }

    public goPrevPage() {
        this.setPage( this.pagination.getCurrentPage() - 1);
    }

    private createPaginationItems(data: IPageData) {

        const items: PageItem[] = [];
        const pageCount: number = data.getPageCount();
        let pages: Array<string | number> = [];

        if (pageCount <= 1) {
            this.pageItems = [];
            return;
        }

        if (pageCount > 5) {

            const currentPage = data.getCurrentPage();
            const subPages: Array<string | number> = [];

            pages = [1, pageCount];

            if (currentPage - 1 > 2) {
                subPages.push('...');
            }

            // set starting index for j
            let j: number =
                (currentPage === 1) ? 0 : (currentPage === pageCount) ? -2 : -1;

            /**
             * default calculate
             * from j = -1, to j = 1
             *
             * currentPage = 1
             * from j = 0 to j = 2
             *
             * currentPage = pageCount
             * from j = -2 to j = 0;
             *
             * ----
             * from i = 2 to 0 => cP + j
             */
            for (let i = 2; i >= 0; i-- , j++) {
                if (currentPage + j === 1 || currentPage + j === pageCount) {
                    continue;
                }
                subPages.push(currentPage + j);
            }

            if (pageCount - currentPage > 2) {
                subPages.push('...');
            }

            pages.splice(1, 0, ...subPages);
        } else {
            // create 1 ... n ( max 5 ) elements
            pages = Array
                .from(Array(pageCount).keys())
                .map((value, index) => {
                    return index + 1;
                });
        }

        for (const page of pages) {
            items.push(this.createPageItem(page));
        }

        this.pageItems = items;
    }

    private createPageItem(page: number | string): PageItem {

        let item: PageItem;
        let canActivate: boolean;
        let isActive: boolean;

        isActive = this.pagination.getCurrentPage() === page;

        canActivate = true;
        canActivate = typeof page === 'number';
        canActivate = canActivate && ! isActive;

        item = {content: page, canActivate, isActive};
        return item;
    }
}
