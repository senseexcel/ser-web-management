import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SerAppProvider, SelectionProvider } from '@qlik/provider';
import { ISERApp } from '@qlik/api/ser.response.interface';
import { IServiceProvider } from 'angular';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html'
})
export class AppListComponent implements OnInit {

    public qlikApps: ISERApp[] = [];

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
    public deleteApp(app: ISERApp) {
        // @TODO implement
    }

    /**
     * edit existing app
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public editApp(app: ISERApp) {

        const selections = this.selection.getSelection();
        // route to edit
        this.router.navigate([`edit/${selections[0].qapp.qDocId}`], { relativeTo: this.route});
    }

    /**
     * select app in list
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public selectApp(app: ISERApp) {
        this.selection.addSelection(app);
    }
}
