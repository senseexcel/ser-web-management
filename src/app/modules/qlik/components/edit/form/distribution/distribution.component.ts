import { Component, OnInit, HostBinding } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'app-distribution',
    templateUrl: 'distribution.component.html'
})
export class DistributionComponent implements OnInit {

    public distributionMethods = ['email', 'file', 'hub'];

    public selectedMethod: string;

    @HostBinding('class')
    protected hostClass = 'flex-container flex-column';

    constructor() { }

    ngOnInit() { }

    public selectDistributionMethod(method: MatSelectChange) {
        this.selectedMethod = method.value;
    }
}
