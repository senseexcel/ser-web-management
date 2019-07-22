import { Component, OnInit, Input } from '@angular/core';
import { ScriptService } from '@smc/modules/ser/provider';
import { EnigmaService } from '@smc/modules/smc-common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ISerReport } from '@smc/pages/apps/api/ser-config.interface';
import { ISerScriptData } from '@smc/modules/ser';

@Component({
    selector: 'smc-report-overview',
    templateUrl: 'report-overview.html',
    styleUrls: ['./report-overview.scss']
})
export class ReportListComponent implements OnInit {

    private script: ISerScriptData;

    private appId: string;

    @Input()
    public reports: ISerReport[];

    constructor(
        private scriptService: ScriptService,
        private enigmaService: EnigmaService,
        private activatedRoute: ActivatedRoute
    ) { }

    public ngOnInit() {

        this.activatedRoute.params.pipe(
            tap((params)   => this.appId = params.id),
            map((params)   => params.id),
            switchMap((id) => this.enigmaService.getAppScript(id)),
            map((script)   => this.scriptService.parse(script)),
            catchError(()  => of(null))
        )
        .subscribe({
            next: (scriptData) => {
                const reports = this.scriptService.extractReports(scriptData);
                this.script   = scriptData;
                this.reports  = reports;
            }
        });
    }

    public async cloneReport(report: ISerReport) {
        const cloned = JSON.parse(JSON.stringify(report));
        await this.saveChanges();
        this.reports = this.scriptService.addReport(this.script, cloned);
    }

    public editReport(report: ISerReport) {
    }

    public async deleteReport(report: ISerReport) {
        await this.saveChanges();
        this.reports = this.scriptService.removeReport(this.script, report);
    }

    private saveChanges(): Promise<any> {
        /** save this now */
        return this.enigmaService.writeScript(
            this.scriptService.stringify(this.script),
            this.appId
        );
    }
}
