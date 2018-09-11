import { NgModule } from '@angular/core';
import { ReportService } from '@core/modules/ser-report/services/report.service';
import { CleanReportPipe } from '@core/modules/ser-report/pipe/clean.json';

@NgModule({
    imports: [],
    exports: [ CleanReportPipe ],
    declarations: [ CleanReportPipe ],
    providers: [ReportService],
})
export class SerReportModule { }
