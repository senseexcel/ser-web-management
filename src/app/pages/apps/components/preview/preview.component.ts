import { Component, OnInit } from '@angular/core';
import { FormService } from '@smc/modules/form-helper';
import { ISerReport } from '../../api/ser-config.interface';
import { IApp, ReportModel } from '@smc/modules/ser';

@Component({
    selector: 'smc-report-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss']
})

export class ReportPreviewComponent implements OnInit {

    public appName: string;

    public data: ISerReport;

    constructor(
        private formService: FormService<ReportModel, void>
    ) {
        this.formService = formService;
    }

    ngOnInit() {
        this.formService.editModel()
        .subscribe( (report: ReportModel) => {
            if (!report) {
                return;
            }
            this.data = report.raw;
        });
    }
}
