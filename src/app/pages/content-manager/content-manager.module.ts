import { NgModule } from '@angular/core';
import { ContentManagerRoutingModule } from './content-manager.routing.module';
import { SmcUiModule, MaterialModule, SmcCommonModule } from '@smc/modules';
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
        SmcCommonModule,
        SmcUiModule,
    ],
    providers: [],
})
export class ContentManagerModule {}
