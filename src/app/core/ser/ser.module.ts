import { NgModule } from '@angular/core';
import { CleanReportPipe } from './pipes/clean.json';
import { ScriptService, ReportService } from './provider';
import { SmcCommonModule } from '../common/common.module.js';
import { QrsModule } from '../qrs/qrs.module.js';

@NgModule({
    imports: [SmcCommonModule, QrsModule],
    exports: [CleanReportPipe],
    declarations: [CleanReportPipe],
    providers: [ScriptService, ReportService]
})
export class SerModule { }
