import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { IQlikApp } from '@apps/api/app.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { TaskManagerService } from '@core/modules/ser-task/services/task-manager.service';

@Component({
    selector: 'app-task-new',
    templateUrl: 'new.component.html'
})

export class NewComponent implements OnInit {
    name = new FormControl('');
    public tasks: ITask[];

    constructor(
        private router: Router,
        private appManager: SerAppManagerService,
        private api: SerTaskService,
        private taskManager: TaskManagerService
        ) { }
        
        ngOnInit() { 

        }
        onApply() {

            const app: IQlikApp = this.appManager.getSelectedApps()[0]
            const newTask: ITask = {
                app: {
                    id: app.qDocId,
                    name: app.qDocName
                },
                customProperties: [], //default
                enabled: true, //default
                isManuallyTriggered: false, //default
                maxRetries: 0, //default
                name: this.name.value,
                tags: [], //default
                taskSessionTimeout: 1440, //default
                taskType: 0, //default 
            }
            this.api.createTask(newTask)
            .pipe(
                catchError((err, caught) => {
                    console.log(err);
                    console.log(caught);
                    return of(null);
                })
            )
            .subscribe((task: ITask) => {
                const mockTask = {
                    app: {
                        id: app.qDocId,
                        name: app.qDocName
                    },
                    name: "some name",
                    tags: [],
                    id: "30f7b1a7-a927-4ee4-a763-ffaf218add1d"
                }
                this.taskManager.addTask(task)
                this.router.navigate(['/apps', 'edit', app.qDocId, 'tasks', 'edit', mockTask.id])
            });
            
        }
    }
    