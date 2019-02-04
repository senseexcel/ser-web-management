import { PipeTransform, Pipe } from '@angular/core';
import { ReportService } from '@smc/modules/ser/provider/report.service';
import { ISerReport } from '../api/report.interface';

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
