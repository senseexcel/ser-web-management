import { NgModule } from '@angular/core';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';
import { SerScriptModule } from '@core/modules/ser-script/ser-script.module';
import { SerReportModule } from '@core/modules/ser-report/ser-report.module';

@NgModule({
    imports: [
        SerEngineModule,
        SerScriptModule,
        SerReportModule
    ],
    exports: [ SerReportModule ],
    providers: [SerAppManagerService],
})
export class SerAppModule { }
