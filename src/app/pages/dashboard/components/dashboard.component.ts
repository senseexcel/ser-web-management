import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { IMenuItem, IPage, IPageInformation } from '@smc/modules/menu';

/** @deprecated in next version this is general app information */
import { PAGE_SETTINGS } from '../../../model/page.model';
import { AppRepository, TaskRepository, FilterFactory } from '@smc/modules/qrs';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings } from '@smc/modules/smc-common';
import { CacheService } from '@smc/pages/apps/providers/cache.service';

@Component({
    selector: 'smc-dashboard',
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

    private router: Router;

    public pageTiles;

    /**
     *Creates an instance of DashboardComponent.
     * @memberof DashboardComponent
     */
    constructor(
        @Inject(SMC_SESSION) private settings: ISettings,
        @Inject(PAGE_SETTINGS) private pages,
        router: Router,
        private appRepository: AppRepository,
        private taskRepository: TaskRepository,
        private filterFactory: FilterFactory,
        private cache: CacheService
    ) {
        this.router = router;
        console.log(this.cache);
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
                this.mainMenu = this.pages;
                this.pageTiles = this.createPageTileData(counts, this.pages);
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
                case 'Reporting Apps' : title = `${item.name} (${counts[1]})`; break;
                case 'Reporting Tasks': title = `${item.name} (${counts[0]})`; break;
                default               : title = item.name;
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

        if (!this.settings.serTag) {
            return of(0);
        }

        const taskFilter = this.filterFactory.createFilter(
            'tags.id', this.settings.serTag.id);

        return this.taskRepository.fetchTaskCount(taskFilter);
    }

    /**
     * fetch count of all sense excel reporting apps
     *
     * @private
     * @returns {Observable<number>}
     * @memberof DashboardComponent
     */
    private fetchSerApps(): Observable<number> {
        if (!this.settings.serTag) {
            return of(0);
        }

        const appFilter = this.filterFactory.createFilter(
            'tags.id', this.settings.serTag.id
        );
        return this.appRepository.fetchAppCount(appFilter);
    }
}
