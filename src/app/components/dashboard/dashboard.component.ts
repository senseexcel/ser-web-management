import { Component, OnInit, HostBinding } from '@angular/core';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { Observable, forkJoin, of } from 'rxjs';
import { PageService } from '../../services';
import { IPageInformation } from '@api/page-information.interface';
import { SerAppService } from '@core/modules/ser-engine/provider/ser-app.provider';
import { IPage } from '@api/page.interface';
import { Router } from '@angular/router';
import { IMenuItem } from '@core/modules/menu/api/menu-item.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

    @HostBinding('class.dashboard')
    public static readonly hostClass = true;

    /**
     * main menu data
     *
     * @type {IMenuItem[]}
     * @memberof DashboardComponent
     */
    public mainMenu: IMenuItem[];

    /**
     * page informations for page tiles
     *
     * @type {IPageInformation[]}
     * @memberof DashboardComponent
     */
    public pages: IPageInformation[] = [];

    private router: Router;

    /**
     * app service to fetch current apps
     *
     * @private
     * @type {SerAppService}
     * @memberof DashboardComponent
     */
    private serAppService: SerAppService;

    /**
     * filter service to create filter for qrs requests
     *
     * @private
     * @type {SerFilterService}
     * @memberof DashboardComponent
     */
    private serFilterService: SerFilterService;

    /**
     * task api service to fetch tassk
     *
     * @private
     * @type {SerTaskService}
     * @memberof DashboardComponent
     */
    private taskApiService: SerTaskService;

    /**
     * page service to get page data
     *
     * @private
     * @type {PageService}
     * @memberof DashboardComponent
     */
    private pageService: PageService;

    /**
     *Creates an instance of DashboardComponent.
     * @memberof DashboardComponent
     */
    constructor(
        pageService: PageService,
        router: Router,
        serAppService: SerAppService,
        serFilterService: SerFilterService,
        taskApiService: SerTaskService
    ) {
        this.pageService      = pageService;
        this.router           = router;
        this.serAppService    = serAppService;
        this.serFilterService = serFilterService;
        this.taskApiService   = taskApiService;
    }

    /**
     *
     *
     * @memberof DashboardComponent
     */
    ngOnInit() {

        const taskCountSource$ = this.fetchTaskCount();
        const serAppCountSource$ = this.fetchSerApps();

        forkJoin(taskCountSource$, serAppCountSource$)
            .subscribe((counts: number[]) => {
                this.mainMenu = this.pageService.pageData;
                this.pages    = this.createPageTileData(counts, this.pageService.pageData);
            });
    }

    /**
     * navigate to page
     *
     * @memberof DashboardComponent
     */
    public displayPage(page: IPage) {
        this.router.navigate([`/${page.route}`]);
    }

    /**
     * create page tile data
     *
     * @private
     * @param {number[]} counts
     * @param {IPage[]} pageData
     * @returns {IPageInformation[]}
     * @memberof DashboardComponent
     */
    private createPageTileData(counts: number[], pageData: IPage[]): IPageInformation[] {
        // flatten menu data to get pages directly
        return pageData.reduce((current: IPage[] | null, previous: IPage) => {
            const children = <IPage[]>previous.children || [];
            if (!current) {
                return children || [previous];
            }

            return current.concat(
                children || previous
            );
        }, null)
        // add title
        .map((item: IPage): IPageInformation => {
            let title: string;
            switch (item.name) {
                case 'Reports'     : title = `${item.name} (${counts[1]})`; break;
                case 'Report Tasks': title = `${item.name} (${counts[0]})`; break;
                default            : title = item.name;
            }
            return { ...item, title };
        });
    }

    /**
     * fetch count of all sense excel reporting tasks
     *
     * @private
     * @returns {Observable<number>}
     * @memberof DashboardComponent
     */
    private fetchTaskCount(): Observable<number> {
        /** task filter
         * @todo filter only ser tasks
        const taskFilter = this.serFilterService.createFilter(
            'app.id',
            '1e85e254-5476-4a39-a599-2cbdba91cafb'
        );
        */

        return this.taskApiService.fetchTaskCount();
    }

    /**
     * fetch count of all sense excel reporting apps
     *
     * @private
     * @returns {Observable<number>}
     * @memberof DashboardComponent
     */
    private fetchSerApps(): Observable<number> {
        // @todo create filter for ser apps
        return this.serAppService.fetchAppCount();
    }
}
