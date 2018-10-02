import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

    constructor() {}

    @HostBinding('class.dashboard')
    public static readonly hostClass = true;

    ngOnInit() {}
}
