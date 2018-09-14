import { Component, OnInit, Input } from '@angular/core';
import { IQlikApp } from '@apps/api/app.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { ITask } from '@core/modules/ser-engine/api/task.interface';

@Component({
    selector: 'app-ser-tasks',
    templateUrl: 'tasks.component.html',
    styleUrls: ['tasks.component.scss'],
})

export class TasksComponent implements OnInit {

    public tasks: ITask[];

    public tableHeaderFields: string[];

    private taskRestService: SerTaskService;

    constructor(taskRestService: SerTaskService) {
        this.taskRestService = taskRestService;
        this.tasks = [];
    }

    @Input()
    public set app(app: IQlikApp) {
        this.fetchTasks(app.qDocId);
    }

    public ngOnInit() {
        this.tableHeaderFields = ['id', 'name', 'enabled', 'status', 'lastExecution', 'nextExecution', 'tags'];
    }

    private fetchTasks(appId: string) {

        this.taskRestService.fetchTasksForApp(appId)
            .subscribe( (tasks) => {
                console.log(tasks);
                this.tasks = tasks;
            });
    }
}
