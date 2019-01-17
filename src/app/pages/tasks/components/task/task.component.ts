import { Component, OnInit, Input } from '@angular/core';
import { TaskManagerService } from '../../services/task-manager.service';

@Component({
    selector: 'app-ser-task',
    templateUrl: 'task.component.html',
    styleUrls: ['./task.component.scss'],
    providers: [TaskManagerService]
})

export class TaskComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
