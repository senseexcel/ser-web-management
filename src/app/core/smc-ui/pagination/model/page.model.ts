import { Injectable } from '@angular/core';

@Injectable()
export class PageModel {

    private pageCount: number;

    private currentPage: number;

    private itemCount: number;

    private itemPageCount: number;

    public getPageCount(): number {
        return this.pageCount;
    }

    public setPageCount(count: number) {
        this.pageCount = count;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public setCurrentPage(page: number) {
        this.currentPage = page;
    }

    public getItemCount(): number {
        return this.itemCount;
    }

    public setItemCount(count: number) {
        this.itemCount = count;
    }

    public getItemPageCount(): number {
        return this.itemPageCount;
    }

    public setItemPageCount(count: number) {
        this.itemPageCount = count;
    }
}
