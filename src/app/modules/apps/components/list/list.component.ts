import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IQlikApp } from '@apps/api/app.interface';
import { SerAppManagerService } from '@core/modules//ser-app/provider/ser-app-manager.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, empty, Observable } from 'rxjs';
import { ListHeaderService } from '@core/modules/list-header/services/list-header.service';
import { AppData } from '@core/model/app-data';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
    viewProviders: [ListHeaderService]
})
export class AppListComponent implements OnInit {

    public qlikApps: IQlikApp[] = [];

    public tableHeaders: string[] = ['name', 'id'];

    public isLoading = true;

    public selection: SelectionModel<IQlikApp>;

    private serAppsSub: Subscription;

    private appManager: SerAppManagerService;

    private router: Router;

    private route: ActivatedRoute;

    private listHeaderService: ListHeaderService;

    private dialogService: ModalService;

    public appData: AppData;

    constructor(
        @Inject('AppData') appData: AppData,
        dialog: ModalService,
        route: ActivatedRoute,
        routerProvider: Router,
        appManager: SerAppManagerService,
        listHeaderService: ListHeaderService
    ) {
        this.route      = route;
        this.router     = routerProvider;
        this.appManager = appManager;
        this.selection  = new SelectionModel<IQlikApp>();
        this.appData = appData;

        this.listHeaderService = listHeaderService;
        this.dialogService = dialog;
     }

    public async ngOnInit() {

        this.serAppsSub = this.appManager.loadSerApps()
            .subscribe( (apps) => {
                this.isLoading = false;
                this.qlikApps = apps;

                this.listHeaderService.updateData({
                    total: apps.length, showing: apps.length, selected: 0
                });
            });
    }

    /**
     * delete existing app
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public deleteApp(app: IQlikApp) {
    }

    /**
     * edit existing app
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public editApp() {
        this.appManager.selectApps(this.selection.selected);
        this.router.navigate([`edit/${this.selection.selected[0].qDocId}`], { relativeTo: this.route});
    }

    /**
     * select app in list
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public selectApp(app: IQlikApp) {
        this.selection.select(app);

        this.listHeaderService.updateData({
            total: this.qlikApps.length,
            showing: this.qlikApps.length,
            selected: this.selection.selected.length
        });
    }

    /**
     * create new app action
     *
     * @memberof AppListComponent
     */
    public createApp() {
        this.router.navigate([`new`], { relativeTo: this.route});
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

        const updateStream$ = this.appManager.updateSerAppsWithTag()
            .pipe(tap((apps) => {
                console.dir(apps);
                return this.dialogService.openMessageModal('Apps Synchronized', `${apps.length} App(s) where synchronized.`);
            }));

        const dialogCtrl    = this.dialogService.openDialog(
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
                switchMap(() => this.reloadApps())
            )
            .subscribe((apps) => {
                this.isLoading = false;
                this.qlikApps = apps;
            });
    }

    /**
     * reload all apps in list
     *
     * @private
     * @returns {Observable<IQlikApp[]>}
     * @memberof AppListComponent
     */
    private reloadApps(): Observable<IQlikApp[]> {
        return this.appManager.loadSerApps(true)
            .pipe(
                tap((apps: IQlikApp[]) => {
                    this.listHeaderService.updateData({
                        total: apps.length, showing: apps.length, selected: 0
                    });
                    this.qlikApps = apps;
                })
            );
    }
}
