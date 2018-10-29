import { Component, OnInit, Host } from '@angular/core';
import { ListHeaderService } from '@core/modules/list-header/services/list-header.service';
import { IListData } from '@core/modules/list-header/api/list-data.interface';

@Component({
    selector: 'app-list-header',
    templateUrl: 'list-header.component.html',
    styleUrls: ['list-header.component.scss']
})

export class ListHeaderComponent implements OnInit {

    public listData: IListData;

    private listDataService: ListHeaderService;

    constructor(
        @Host() listHeaderService: ListHeaderService
    ) {
        this.listDataService = listHeaderService;
    }

    ngOnInit() {
        /** list data service */
        this.listDataService.updated.subscribe((data: IListData) => {
            this.listData = data;
        });
    }
}
