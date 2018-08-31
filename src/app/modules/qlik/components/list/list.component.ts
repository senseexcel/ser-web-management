import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ContentChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IQlikApp } from '@serEngine/api/app.interface';
import { SerAppProvider } from '@serEngine/provider/ser-app.provider';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html'
})
export class AppListComponent implements OnInit {

    public qlikApps: IQlikApp[] = [];

    public tableHeaders: string[] = ['name', 'id'];

    private serAppProvider: SerAppProvider;

    /**
     * selection model to handle selections on table
     *
     * @private
     * @type {SelectionModel<IQlikApp>}
     * @memberof AppListComponent
     */
    private selectedApps: SelectionModel<IQlikApp>;

    private router: Router;

    private route: ActivatedRoute;

    constructor(
        route: ActivatedRoute,
        routerProvider: Router,
        serAppProvider: SerAppProvider
    ) {
        this.route  = route;
        this.router = routerProvider;
        this.selectedApps = new SelectionModel<IQlikApp>(false);
        this.serAppProvider = serAppProvider;
     }

    public async ngOnInit() {
        this.qlikApps = await this.serAppProvider.fetchApps();
    }

    /**
     * delete existing app
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public deleteApp(app: IQlikApp) {
        // @TODO implement
    }

    /**
     * edit existing app
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public editApp(app: IQlikApp) {

        if ( this.selectedApps.isEmpty() ) {
            return;
        }

        /**
         * since we only have single select mode
         * there can be only one element in selection
         */
        const appId = this.selectedApps.selected[0];

        // route to edit
        this.router.navigate([`edit/${appId.qDocId}`], { relativeTo: this.route});
    }

    /**
     * select app in list
     *
     * @param {IQlikApp} app
     * @memberof AppListComponent
     */
    public selectApp(app: IQlikApp) {
        this.selectedApps.toggle(app);
    }
}
