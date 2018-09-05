import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionProvider } from '@qlik/provider';
import { ISerApp, SerAppProvider } from '@ser-app/index';
import { IQlikApp } from '@qlik/api/app.interface';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html'
})
export class AppListComponent implements OnInit {

    public qlikApps: IQlikApp[] = [];

    public tableHeaders: string[] = ['name', 'id'];

    public isLoading = true;

    private serAppProvider: SerAppProvider;

    private router: Router;

    private route: ActivatedRoute;

    private selection: SelectionProvider;

    constructor(
        route: ActivatedRoute,
        routerProvider: Router,
        serAppProvider: SerAppProvider,
        selectionProvider: SelectionProvider
    ) {
        this.route  = route;
        this.router = routerProvider;
        this.serAppProvider = serAppProvider;
        this.selection = selectionProvider;
     }

    public async ngOnInit() {

        this.serAppProvider.fetchSenseExcelReportingApps()
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
    public deleteApp(app: ISerApp) {
        // @TODO implement
    }

    /**
     * edit existing app
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public editApp(app: ISerApp) {

        const selections = this.selection.getSelection();
        // route to edit
        this.router.navigate([`edit/${selections[0].qDocId}`], { relativeTo: this.route});
    }

    /**
     * select app in list
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public selectApp(app: IQlikApp) {
        this.selection.addSelection(app);
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
