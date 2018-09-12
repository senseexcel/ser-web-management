import { Component, OnInit, Input } from '@angular/core';
import { IQlikApp } from '@apps/api/app.interface';
import { SerTaskRestService } from '@core/modules/ser-engine/provider/ser-task-rest.service';

@Component({
    selector: 'app-ser-tasks',
    templateUrl: 'tasks.component.html',
    styleUrls: ['tasks.component.scss'],
})

export class TasksComponent implements OnInit {

    private taskRestService: SerTaskRestService;

    constructor(taskRestService: SerTaskRestService ) {
        this.taskRestService = taskRestService;
    }

    @Input()
    public set app(app: IQlikApp) {
        this.taskRestService.fetchTasksForApp(app.qDocId);
    }

    public ngOnInit() {
    }
}
