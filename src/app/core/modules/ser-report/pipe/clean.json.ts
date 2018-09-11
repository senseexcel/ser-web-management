import { PipeTransform, Pipe } from '@angular/core';
import { ReportService } from '@core/modules/ser-report/services/report.service';
import { ISerReport } from '@apps/api/ser-config.interface';

@Pipe({
    name: 'cleanReport'
})
export class CleanReportPipe implements PipeTransform {

    private reportService: ReportService;

    public constructor(
        reportService: ReportService
    ) {
        this.reportService = reportService;
    }

    transform(report: ISerReport): any  {
        return this.reportService.cleanReport(report);
    }
}
