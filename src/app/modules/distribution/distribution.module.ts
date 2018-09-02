import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatTabsModule, MatSelectModule } from '@angular/material';

import {
    DistributionComponent,
    DistributionFileComponent,
    DistributionHubComponent,
    DistributionMailComponent
} from '@distribution/components';

@NgModule({
    imports: [ CommonModule, MatInputModule, MatTabsModule, MatSelectModule, ReactiveFormsModule ],
    exports: [ DistributionComponent ],
    declarations: [
        DistributionComponent,
        DistributionFileComponent,
        DistributionHubComponent,
        DistributionMailComponent
    ],
    providers: [],
})
export class DistributionModule { }
