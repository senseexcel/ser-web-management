import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-monitoring-page',
    styleUrls: ['./monitoring-page.component.scss'],
    templateUrl: 'monitoring-page.component.html',
})

export class MonitoringPageComponent implements OnInit {

    public ready: boolean;

    constructor() { }

    ngOnInit() {
        this.ready = true;
    }
}
