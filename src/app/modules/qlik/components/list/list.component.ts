import { Component, OnInit } from '@angular/core';
import { SerAppProvider } from '@serEngine/provider/ser-app.provider';
import { IQlikApp } from '@serEngine/api/app.interface';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html'
})
export class AppListComponent implements OnInit {

    public qlikApps: IQlikApp[] = [];

    public tableHeaders: string[] = ['id', 'name', 'filesize'];

    private serAppProvider: SerAppProvider;

    constructor(serAppProvider: SerAppProvider) {
        this.serAppProvider = serAppProvider;
     }

    public async ngOnInit() {
        this.qlikApps = await this.serAppProvider.fetchApps();
    }
}
