import { Component, OnInit } from '@angular/core';
import { SmcCache, IDataNode } from '@smc/modules/smc-common';

@Component({
    selector: 'smc-report-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss']
})

export class ReportPreviewComponent implements OnInit {

    public appName: string;

    public previewData: IDataNode;

    constructor(
        private cache: SmcCache
    ) {}

    ngOnInit() {
        this.previewData = this.cache.get('smc.pages.report.edit.current.report.raw');
    }
}
