import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IQlikApp } from '@qlik/api/app.interface';
import { SerAppProvider, SelectionProvider } from '@qlik/provider';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html'
})
export class AppListComponent implements OnInit {

    public qlikApps: IQlikApp[] = [];

    public tableHeaders: string[] = ['name', 'id'];

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
}
