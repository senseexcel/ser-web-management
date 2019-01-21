import { NgModule } from '@angular/core';
import { ContentManagerRoutingModule } from './content-manager.routing.module';
import { SmcUiModule, MaterialModule } from '@smc/modules';
import { ListComponent } from './components/list.component';
import { CommonModule } from '@angular/common';
import { PaginationModule } from '@smc/modules/smc-ui';

@NgModule({
    declarations: [
        ListComponent
    ],
    entryComponents: [
        ListComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        ContentManagerRoutingModule,
        MaterialModule,
        PaginationModule,
        SmcUiModule,
    ],
    providers: [],
})
export class ContentManagerModule {}
