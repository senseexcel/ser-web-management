import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, empty, Observable, of } from 'rxjs';
import { ModalService } from '@smc/modules/modal';
import { switchMap } from 'rxjs/operators';
import { IApp } from '@smc/modules/qrs';
import { SMC_SETTINGS } from '@smc/modules/common/model/settings.model';
import { ISettings, SmcCache } from '@smc/modules/common';
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

    private serAppsSub: Subscription;

    private router: Router;

    private route: ActivatedRoute;

    private dialogService: ModalService;

    constructor(
        @Inject(SMC_SETTINGS) private settings: ISettings,
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

        if (!this.smcCache.has('ser.apps')) {
            this.isLoading = false;
            this.apps = this.smcCache.get<IApp[]>('ser.apps');
        } else {
            this.appRepository.fetchApps()
                .subscribe((apps: IApp[]) => {
                    this.isLoading = false;
                    this.apps = apps;
                });
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
        this.isLoading = true;

        this.selection.clear();
        this.serAppsSub.unsubscribe();
        this.serAppsSub = this.reloadApps().subscribe(() => {
            this.isLoading = false;
        });

        return this.serAppsSub;
    }

    /**
     * add tag SER to all sense excel reporting apps which dont have
     * the tag but got script
     *
     * @memberof AppListComponent
     */
    public repairApps() {

        /*
        const updateStream$ = this.appManager.updateSerAppsWithTag()
            .pipe(
                tap((apps) => {
                    return this.dialogService.openMessageModal('Apps Synchronized', `${apps.length} App(s) where synchronized.`);
                }),
                switchMap(() => this.reloadApps())
            );
            */
        const updateStream$ = of(true);

        const dialogCtrl = this.dialogService.openDialog(
            'Synchronize SER Apps',
            'This will Synchronize Sense Excel Reporting Apps and add SER Tag to App. This can take a while...'
        );

        dialogCtrl.switch
            .pipe(
                switchMap((confirm: boolean) => {
                    if (confirm) {
                        this.isLoading = true;
                        return updateStream$;
                    }
                    return empty();
                }),
            )
            .subscribe(() => {
                this.isLoading = false;
            });
    }

    /**
     * reload all apps in list
     *
     * @private
     * @returns {Observable<IApp[]>}
     * @memberof AppListComponent
     */
    private reloadApps(): Observable<IApp[]> {
        /*
        return this.appManager.loadSerApps(true)
            .pipe(
                tap((apps: IApp[]) => {
                    this.qlikApps = apps;
                })
            );
        */
        return of([]);
    }
}
