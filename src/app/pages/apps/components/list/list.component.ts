import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { EMPTY } from 'rxjs';
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
export class AppListComponent implements OnInit, OnDestroy {

    public apps: IApp[] = [];
    public tableHeaders: string[] = ['name', 'id'];
    public isLoading = true;
    public selection: SelectionModel<IApp>;

    private router: Router;
    private route: ActivatedRoute;
    private dialogService: ModalService;

    constructor(
        @Inject(SMC_SESSION) public session: ISettings,
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
            this.apps = this.smcCache.get<IApp[]>('ser.apps');
            this.isLoading = false;
        } else {
            this.loadApps();
        }
    }

    public ngOnDestroy() {
        this.selection.clear();
    }

    /**
     * delete existing app
     *
     * @param {IApp} app
     * @memberof AppListComponent
     */
    public deleteApp() {

        if (this.selection.isEmpty()) {
            return;
        }

        const dialogCtrl = this.dialogService.openDialog(
            'SMC_APPS.LIST.DIALOG.DELETE_APP_TITLE',
            {
                key: 'SMC_APPS.LIST.DIALOG.DELETE_APP_MESSAGE',
                param: {
                    APP_NAME: this.selection.selected[0].name
                }
            }
        );

        dialogCtrl.switch.pipe(
            switchMap((confirm: boolean) => {
                if (confirm) {
                    return this.appRepository.deleteApp(this.selection.selected[0].id);
                }
                return EMPTY;
            }),
        ).subscribe({
            next: () => {
                const config = {
                    key: 'SMC_APPS.LIST.DIALOG.DELETE_APP_MESSAGE_SUCCESS',
                    param: { APP_NAME: this.selection.selected[0].name }
                };
                const title = 'SMC_APPS.LIST.DIALOG.DELETE_APP_TITLE_SUCCESS';
                this.dialogService.openMessageModal(title, config);
                this.selection.clear();
                this.loadApps();
            }
        });
    }

    /**
     * edit existing app
     *
     * @param {IApp} app
     * @memberof AppListComponent
     */
    public editApp() {

        const modal = this.dialogService.openInfoModal({
            key: 'SMC_APPS.LIST.DIALOG.OPEN_APP',
            param: { APP_NAME: this.selection.selected[0].name }
        });

        this.router
            .navigate([`edit/${this.selection.selected[0].id}`], { relativeTo: this.route })
            .then((routeChange: boolean) => {
                /** we hit new page */
                if (!routeChange) {
                    this.selection.clear();
                }
                modal.close();
            });
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
            'SMC_APPS.LIST.DIALOG.SYNC_APPS_TITLE',
            {key: 'SMC_APPS.LIST.DIALOG.SYNC_APPS_MESSAGE'}
        );

        dialogCtrl.switch.pipe(
            switchMap((confirm: boolean) => {
                if (confirm) {
                    this.isLoading = true;
                    return this.appRepository.addTagToSerApps();
                }
                return EMPTY;
            }),
        ).subscribe((apps) => {
            this.dialogService.openMessageModal(
                'SMC_APPS.LIST.DIALOG.SYNC_APPS_TITLE_SUCCESS',
                {
                    key: 'SMC_APPS.LIST.DIALOG.SYNC_APPS_MESSAGE_SUCCESS',
                    param: { COUNT: apps.length }
                }
            );
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
