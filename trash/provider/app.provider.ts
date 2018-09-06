import { Injectable } from '@angular/core';
import { ReportProvider, SerAppProvider, ISerReport } from '@ser-app/index';
import { QAppModel } from '@qlik/model/qapp.model';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ISerConnection, ISerGeneral, ISerTemplate } from 'ser.api';
import { defaultScript } from '@ser-app/data/default-script';
import * as hjson from 'hjson';

@Injectable()
export class AppProvider {

    public onUpdate$: Subject<string>;

    private model: QAppModel;

    private reportProvider: ReportProvider;

    private serAppProvider: SerAppProvider;

    constructor(
        reportProvider: ReportProvider,
        serAppProvider: SerAppProvider
    ) {
        this.reportProvider = reportProvider;
        this.serAppProvider = serAppProvider;
        this.onUpdate$ = new Subject<string>();
    }

    public loadApp(appId: string): Observable<EngineAPI.IApp> {

    }

    /**
     * create new qlik app for sense excel reporting
     *
     * @param {string} [appName='newSenseExcelReportingApp']
     * @returns {Observable<EngineAPI.IApp>}
     * @memberof AppProvider
     */
    public createApp(appName = 'newSenseExcelReportingApp'): Observable<EngineAPI.IApp> {

        if ( ! this.model ) {
            this.model = new QAppModel();
        }

        return this.serAppProvider.createApplication(appName)
        .pipe(
            mergeMap(async (app: EngineAPI.IApp) => {
                // const script = await app.getScript();
                return { app, script: ''};
            }),
            map((result) => {
                const fullScript      = `${result.script}\n${defaultScript}`;

                this.model.app        = result.app;
                this.model.scriptData = this.reportProvider.parseSerAppScript(fullScript);
                this.model.report     = this.reportProvider.createReport();

                return result.app;
            })
        );
    }

    public async closeApp() {
        await this.model.app.session.close();

        this.model.app = null;
        this.model.scriptData = null;
        this.model.report = null;
    }

    /**
     *
     *
     * @param {ISerReport} report
     * @param {ISerTemplate} data
     * @memberof ReportProvider
     */
    public writeTemplateConfiguration(data: ISerTemplate) {
        this.model.report.template = data;
        this.update();
    }

    public generateReport(): ISerReport {
        const report: ISerReport = {
            connections: this.model.report.connections,
            distribute: this.model.report.distribute,
            general: this.model.report.general,
            template: this.model.report.template,
        };
        return report;
    }

    public async updateScript(script): Promise<void> {
        await this.model.app.setScript(script);
        await this.model.app.doSave();
    }

    private update() {
        const report = this.generateReport();
        const task   = this.serAppProvider.createSerConfig(report);

        const script = ''.concat(
            this.model.scriptData.before,
            hjson.stringify(task),
            this.model.scriptData.after
        );

        this.onUpdate$.next(script);
    }
}
