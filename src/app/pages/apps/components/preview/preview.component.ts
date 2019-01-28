import { Component, OnInit } from '@angular/core';
import { IDataNode } from '@smc/modules/smc-common';
import { CacheService } from '../../providers/cache.service';

@Component({
    selector: 'smc-report-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss']
})

export class ReportPreviewComponent implements OnInit {

    public appName: string;

    public previewData: IDataNode;

    constructor(
        private cache: CacheService
    ) {}

    ngOnInit() {
        this.previewData = this.cache.currentReportData.raw;
    }
}
