import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'app-distribution',
    templateUrl: 'distribution.component.html'
})
export class DistributionComponent implements OnInit {

    public distributionMethods = ['email', 'file', 'hub'];

    public selectedMethod: string;

    constructor() { }

    ngOnInit() { }

    public selectDistributionMethod(method: MatSelectChange) {
        console.log(method);
        this.selectedMethod = method.value;
    }
}
