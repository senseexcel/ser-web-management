import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { DropDownComponent } from './components/drop-down.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [DropDownComponent],
    exports: [DropDownComponent],
    imports: [OverlayModule, CommonModule],
    providers: []
})
export class DropDownModule { }
