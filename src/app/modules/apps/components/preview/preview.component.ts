import { Component, OnInit } from '@angular/core';
import { FormService } from '@core/modules/form-helper';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { ISerReport } from '@apps/api/ser-config.interface';
import { ReportModel } from '@core/modules/ser-report/model';

@Component({
    selector: 'app-report-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss']
})

export class ReportPreviewComponent implements OnInit {

    public appName: string;

    private formService: FormService<ISerApp, null>;

    private data: ISerReport;

    constructor(
        formService: FormService<ISerApp, null>
    ) {
        this.formService = formService;
    }

    ngOnInit() {
        this.formService.loadApp()
        .subscribe( (app: ISerApp) => {
            if ( app === null ) {
                return;
            }
            const report = (app.report as ReportModel).raw;
            this.appName = app.title;
            this.data = report;
        });
    }
}
