import { NgModule } from '@angular/core';
import { ContentManagerRoutingModule } from './content-manager.routing.module';
import { ContentManagerPageComponent } from './pages/page.component';
import { SmcCommonModule } from '@smc/modules';

@NgModule({
    declarations: [ContentManagerPageComponent],
    entryComponents: [ContentManagerPageComponent],
    exports: [],
    imports: [
        ContentManagerRoutingModule,
        SmcCommonModule
    ],
    providers: [],
})
export class ContentManagerModule {}
