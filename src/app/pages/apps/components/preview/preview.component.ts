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

    private formService: FormService<IApp, null>;

    private data: ISerReport;

    constructor(
        formService: FormService<IApp, null>
    ) {
        this.formService = formService;
    }

    ngOnInit() {
        this.formService.editModel()
        .subscribe( (app: IApp) => {
            if ( app === null ) {
                return;
            }
            const report = (app.report as ReportModel).raw;
            this.appName = app.title;
            this.data = report;
        });
    }
}
