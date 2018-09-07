import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IQlikApp } from '@apps/api/app.interface';
import { SerAppManagerService } from '@core/ser-app/provider/ser-app-manager.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class AppListComponent implements OnInit {

    public qlikApps: IQlikApp[] = [];

    public tableHeaders: string[] = ['name', 'id'];

    public isLoading = true;

    public selection: SelectionModel<IQlikApp>;

    private appManager: SerAppManagerService;

    private router: Router;

    private route: ActivatedRoute;

    constructor(
        route: ActivatedRoute,
        routerProvider: Router,
        appManager: SerAppManagerService
    ) {
        this.route      = route;
        this.router     = routerProvider;
        this.appManager = appManager;
        this.selection  = new SelectionModel<IQlikApp>();
     }

    public async ngOnInit() {

        this.appManager.loadSerApps()
            .subscribe( (apps) => {
                this.isLoading = false;
                this.qlikApps = apps;
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
    }

    /**
     *
     *
     * @memberof AppListComponent
     */
    public createApp() {
        this.router.navigate([`new`], { relativeTo: this.route});
    }
}
