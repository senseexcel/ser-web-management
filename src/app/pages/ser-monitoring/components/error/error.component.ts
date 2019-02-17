import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-monitoring-error',
    styleUrls: ['./error.component.scss'],
    templateUrl: 'error.component.html'
})

export class ErrorComponent implements OnInit {

    @Input()
    public errors: string[];

    constructor() {}

    ngOnInit() {}
}
