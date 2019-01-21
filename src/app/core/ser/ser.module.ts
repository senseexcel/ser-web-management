import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CleanReportPipe } from './pipes/clean.json';
import { ScriptService, ReportService, AppRepository } from './provider';
import { SmcCommonModule } from '@smc/modules/smc-common/smc-common.module';
import { SmcCache } from '@smc/modules/smc-common';
import { QrsModule } from '../qrs/qrs.module.js';

@NgModule({
    imports: [QrsModule, SmcCommonModule],
    exports: [CleanReportPipe],
    declarations: [CleanReportPipe],
    providers: [ScriptService, ReportService, AppRepository,
        {
            provide: APP_INITIALIZER,
            useFactory: (cache: SmcCache) => {
                return () => cache.import({
                    ser: {
                        apps: null
                    }
                });
            },
            deps: [SmcCache],
            multi: true
        }
    ]
})
export class SerModule { }
