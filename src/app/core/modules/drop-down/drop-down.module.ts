import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { DropDownComponent } from '@core/modules/drop-down/components/drop-down.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [DropDownComponent],
    exports: [DropDownComponent],
    imports: [OverlayModule, CommonModule],
    providers: []
})
export class DropDownModule { }
