import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { empty } from 'rxjs';
import { ModalService } from '@smc/modules/modal';
import { switchMap, tap } from 'rxjs/operators';
import { IApp } from '@smc/modules/qrs';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings, SmcCache } from '@smc/modules/smc-common';
import { AppRepository } from '@smc/modules/ser/provider/app.repository';

@Component({
    selector: 'smc-list',
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class AppListComponent implements OnInit {

    public apps: IApp[] = [];

    public tableHeaders: string[] = ['name', 'id'];

    public isLoading = true;

    public selection: SelectionModel<IApp>;

    private router: Router;

    private route: ActivatedRoute;

    private dialogService: ModalService;

    constructor(
        @Inject(SMC_SESSION) public settings: ISettings,
        private appRepository: AppRepository,
        private smcCache: SmcCache,
        dialog: ModalService,
        route: ActivatedRoute,
        routerProvider: Router,
    ) {
        this.route = route;
        this.router = routerProvider;
        this.selection = new SelectionModel<IApp>();

        this.dialogService = dialog;
    }

    public async ngOnInit() {
        if (this.smcCache.has('ser.apps') && Array.isArray(this.smcCache.get('ser.apps'))) {
            this.isLoading = false;
            this.apps = this.smcCache.get<IApp[]>('ser.apps');
        } else {
            this.loadApps();
        }
    }

    /**
     * delete existing app
     *
     * @param {IApp} app
     * @memberof AppListComponent
     */
    public deleteApp(app: IApp) {
    }

    /**
     * edit existing app
     *
     * @param {IApp} app
     * @memberof AppListComponent
     */
    public editApp() {
        this.router.navigate([`edit/${this.selection.selected[0].id}`], { relativeTo: this.route });
    }

    /**
     * select app in list
     *
     * @param {IApp} app
     * @memberof AppListComponent
     */
    public selectApp(app: IApp) {
        this.selection.select(app);
    }

    /**
     * create new app action
     *
     * @memberof AppListComponent
     */
    public createApp() {
        this.router.navigate([`new`], { relativeTo: this.route });
    }

    /**
     * reload list action
     *
     * @memberof AppListComponent
     */
    public reloadList() {
        this.loadApps();
    }

    /**
     * add tag SER to all sense excel reporting apps which dont have
     * the tag but got script
     *
     * @memberof AppListComponent
     */
    public syncApps() {

        const dialogCtrl = this.dialogService.openDialog(
            'Synchronize SER Apps',
            'This will Synchronize Sense Excel Reporting Apps and add SER Tag to App. This can take a while...'
        );

        dialogCtrl.switch
            .pipe(
                switchMap((confirm: boolean) => {
                    if (confirm) {
                        this.isLoading = true;
                        return this.appRepository.addTagToSerApps();
                    }
                    return empty();
                }),
            ).subscribe((apps) => {
                this.dialogService.openMessageModal('Apps Synchronized', `${apps.length} App(s) where synchronized.`);
                this.loadApps();
            });
    }

    /**
     * reload all apps in list
     *
     * @private
     * @returns {Observable<IApp[]>}
     * @memberof AppListComponent
     */
    private loadApps() {
        this.isLoading = true;
        this.appRepository.fetchApps()
            .subscribe((apps: IApp[]) => {
                this.isLoading = false;
                this.apps = apps;
            });
    }
}
