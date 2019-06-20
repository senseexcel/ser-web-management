import { Component, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { IApp } from '@smc/modules/ser';

@Component({
    selector: 'smc-apps--edit-form-distribution',
    templateUrl: 'distribution.component.html',
    styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent {

    public distributionMethods = ['email', 'file', 'hub'];

    public selectedMethod: string;

    @Input()
    public app: IApp;

    public selectDistributionMethod(method: MatSelectChange) {
        this.selectedMethod = method.value;
    }
}
