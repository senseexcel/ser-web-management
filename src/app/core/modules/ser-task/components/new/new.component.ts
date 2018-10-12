import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { IQlikApp } from '@apps/api/app.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';
import { SerAppService } from '@core/modules/ser-engine/provider/ser-app.provider';

@Component({
    selector: 'app-task-new',
    templateUrl: 'new.component.html'
})

export class NewComponent implements OnInit {
    name = new FormControl('');
    public tasks: ITask[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private appManager: SerAppManagerService,
        private api: SerTaskService,
        private taskManager: TaskManagerService
    ) { }

        ngOnInit() {
        }

        onApply() {
            const app: IQlikApp = this.appManager.getSelectedApps()[0];
            const newTask: ITask = {
                app: {
                    id: app.qDocId,
                    name: app.qDocName
                },
                customProperties: [], // default
                enabled: true, // default
                isManuallyTriggered: false, // default
                maxRetries: 0, // default
                name: this.name.value,
                tags: [], // default
                taskSessionTimeout: 1440, // default
                taskType: 0, // default
            };

            this.api.createTask(newTask)
            .pipe(
                catchError((err, caught) => {
                    return of(null);
                })
            )
            .subscribe((task: ITask) => {
                this.taskManager.addTask(task);
                this.taskManager.selectTasks([task]);
                this.router.navigate(['../edit', task.id], {relativeTo: this.route});
            });
        }
    }
