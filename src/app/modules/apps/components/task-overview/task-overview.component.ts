import { Component, OnInit } from '@angular/core';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { IQlikApp } from '@apps/api/app.interface';

@Component({
    selector: 'app-task-overview',
    templateUrl: 'task-overview.component.html',
    styleUrls: ['./task-overview.component.scss']
})

export class TaskOverviewComponent implements OnInit {

    public app: IQlikApp;

    private appManagerService: SerAppManagerService;

    constructor(
        appManagerService: SerAppManagerService
    ) {
        this.appManagerService = appManagerService;
    }

    ngOnInit() {
        this.app = this.appManagerService.getSelectedApps()[0];
    }
}
