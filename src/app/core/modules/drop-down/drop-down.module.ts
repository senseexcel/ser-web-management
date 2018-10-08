import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { DropDownComponent } from '@core/modules/drop-down/components/drop-down.component';
import { DropDownService } from '@core/modules/drop-down/services/drop-down.service';

@NgModule({
    declarations: [DropDownComponent],
    exports: [DropDownComponent],
    imports: [OverlayModule],
    providers: [DropDownService]
})
export class DropDownModule { }
