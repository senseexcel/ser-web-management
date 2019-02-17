import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IConfig, IPageData } from '../api';
import { PageModel } from '../model/page.model';

@Injectable()
export class PaginationService {

    private disabled: boolean;

    private pageModel: PageModel;

    public pageChange: Subject<number>;

    public pageUpdate: Subject<IPageData>;

    constructor() {
        this.pageModel  = new PageModel();
        this.pageChange = new Subject();
        this.pageUpdate = new Subject<IPageData>();
    }

    /**
     * configure service
     *
     * @param {({} | string)} data
     * @param {number} [value]
     */
    public configure(data: IConfig, value?: number): void {
        this.pageModel.setCurrentPage(data.currentPage);
        this.pageModel.setItemPageCount(data.itemPageCount);
    }

    public disable(disable: boolean) {
        this.disabled = disable;
    }

    public isDisabled(): boolean {
        return this.disabled;
    }

    public getCurrentPage(): number {
        return this.pageModel.getCurrentPage();
    }

    /**
     * returns true if current page is the last page of set
     *
     * @returns {boolean}
     * @memberof PaginationService
     */
    public isLastPage(): boolean {
        return this.getCurrentPage() === this.pageModel.getPageCount();
    }

    /**
     * display specific page
     *
     * @param {number} page
     */
    public showPage(page: number): void {

        let validPage = false;
        validPage = this.pageModel.getPageCount() ? this.pageModel.getPageCount() >= page : true;
        validPage = validPage && page > 0;

        if (validPage) {
            this.pageModel.setCurrentPage(page);
            this.pageChange.next(page);
        }
    }

    /**
     * display next page
     *
     * @memberof PaginationService
     */
    public showNextPage(): void {
        this.showPage(this.getCurrentPage() + 1);
    }

    /**
     * display prev page
     *
     * @memberof PaginationService
     */
    public showPrevPage(): void {
        this.showPage(this.getCurrentPage() - 1);
    }

    /**
     * update data this will trigger PaginationService.UPDATE event
     *
     * @param {({} | string)} data
     * @param {number} [value]
     */
    public update(data: IConfig, value?: number): void {
        this.pageModel.setItemCount(data.itemTotalCount);
        this.pageModel.setPageCount(
            Math.ceil(this.pageModel.getItemCount() / this.pageModel.getItemPageCount()));

        this.pageUpdate.next(this.pageModel);
    }
}
