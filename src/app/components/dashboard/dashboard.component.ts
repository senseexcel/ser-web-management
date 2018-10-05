import { Component, OnInit, HostBinding } from '@angular/core';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { Observable, forkJoin, of } from 'rxjs';
import { PageService } from '../../services';
import { IPageInformation } from '@api/page-information.interface';
import { SerAppService } from '@core/modules/ser-engine/provider/ser-app.provider';
import { IPage } from '@api/page.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

    @HostBinding('class.dashboard')
    public static readonly hostClass = true;

    public pages: IPageInformation[] = [];

    private router: Router;

    private serAppService: SerAppService;

    private serFilterService: SerFilterService;

    private taskApiService: SerTaskService;

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
                this.pageService.getPageData().forEach((page) => {
                    let title: string;
                    switch (page.name) {
                        case 'Reports':
                            title =  `${page.name} (${counts[1]})`;
                            break;
                        case 'Report Tasks':
                            title =  `${page.name} (${counts[0]})`;
                            break;
                        default:
                            title = page.name;
                    }

                    this.pages.push({
                        ...page,
                        title
                    });
                });
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
