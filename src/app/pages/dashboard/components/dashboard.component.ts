import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';

import { AppRepository, TaskRepository, FilterFactory, SharedContentRepository } from '@smc/modules/qrs';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings, IDataNode, EnigmaService } from '@smc/modules/smc-common';
import { SettingsService } from 'src/app/services/settings.service';
import { ITile } from '../api/tile.interface';
import { map } from 'rxjs/operators';
import { PageModel } from 'src/app/model/page.model';
import { IMenuItem } from '@smc/modules/smc-ui/api';
import { IAppPage } from '@api/app-page.interface';

@Component({
    selector: 'smc-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

    @HostBinding('class.dashboard')
    public static readonly hostClass = true;
    public mainMenu: IMenuItem[];
    public pageTiles: ITile[];
    public senseExcelEngineVersion: string;

    /**
     *Creates an instance of DashboardComponent.
     * @memberof DashboardComponent
     */
    constructor(
        @Inject(SMC_SESSION) private session: ISettings,
        private enigmaService: EnigmaService,
        private settings: SettingsService,
        private router: Router,
        private appRepository: AppRepository,
        private taskRepository: TaskRepository,
        private filterFactory: FilterFactory,
        private sharendContentRepository: SharedContentRepository
    ) {
    }

    /**
     *
     *
     * @memberof DashboardComponent
     */
    ngOnInit() {

        const taskCountSource$ = this.fetchTaskCount();
        const serAppCountSource$ = this.fetchSerApps();
        const sharedContentSource$ = this.fetchSharedContentCount();

        forkJoin(taskCountSource$, serAppCountSource$, sharedContentSource$)
            .pipe(map((counts) => this.createPageTiles(counts)))
            .subscribe((tiles: ITile[]) => {
                this.mainMenu = this.settings.menu;
                this.pageTiles = tiles;
            });

        this.loadSenseExcelVersion();

    }

    /**
     * navigate to page
     *
     * @memberof DashboardComponent
     */
    public displayPage(page: IAppPage) {
        this.router.navigate([`/${page.route}`]);
    }

    private async loadSenseExcelVersion() {
        const app      = await this.enigmaService.createSessionApp();
        const response = JSON.parse( await app.evaluate(`SER.STATUS('versions: all')`));

        const sensePkg = response.versions.reduce((current, pkg) => {
            if (pkg.name === 'ser-engine') {
                return pkg;
            }
            return current;
        }, {});

        this.senseExcelEngineVersion = sensePkg.version;
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
    private createPageTiles(counts: number[]): ITile[] {
        const [taskCount, appCount, sharedContentCount] = counts;

        return this.settings.pages.map((item: PageModel): ITile => {
            const i18nParams: IDataNode = {};

            switch (item.id) {
                case 'apps': i18nParams.COUNT = appCount; break;
                case 'tasks': i18nParams.COUNT = taskCount; break;
                case 'sharedcontent': i18nParams.COUNT = sharedContentCount; break;
            }

            return {
                ...item.raw,
                ...{
                    description: {
                        key: `SMC_DASHBOARD.TILE.${item.id.toUpperCase()}.DESCRIPTION`,
                    },
                    title: {
                        key: `SMC_DASHBOARD.TILE.${item.id.toUpperCase()}.TITLE`,
                        param: Object.keys(i18nParams).length === 0 ? null : i18nParams
                    }
                }
            };
        });
    }

    /**
     * fetch shared content count
     *
     * @private
     * @returns {Observable<number>}
     * @memberof DashboardComponent
     */
    private fetchSharedContentCount(): Observable<number> {
        return this.sharendContentRepository.count();
    }

    /**
     * fetch count of all sense excel reporting tasks
     *
     * @private
     * @returns {Observable<number>}
     * @memberof DashboardComponent
     */
    private fetchTaskCount(): Observable<number> {

        if (!this.session.serTag) {
            return of(0);
        }

        const taskFilter = this.filterFactory.createFilter(
            'tags.id', this.session.serTag.id);

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
        if (!this.session.serTag) {
            return of(0);
        }
        const appFilter = this.filterFactory.createFilter(
            'tags.id', this.session.serTag.id
        );
        return this.appRepository.fetchAppCount(appFilter);
    }
}
