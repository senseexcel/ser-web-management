import { NgModule } from '@angular/core';
import { SerAppManagerService } from '@core/ser-app/provider/ser-app-manager.service';
import { SerEngineModule } from '@core/ser-engine/ser-engine.module';
import { SerScriptModule } from '@core/ser-script/ser-script.module';
import { SerReportModule } from '@core/ser-report/ser-report.module';

@NgModule({
    imports: [
        SerEngineModule,
        SerScriptModule,
        SerReportModule
    ],
    exports: [],
    providers: [SerAppManagerService],
})
export class SerAppModule { }
