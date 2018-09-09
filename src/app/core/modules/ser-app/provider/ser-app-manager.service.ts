import { Injectable } from '@angular/core';
import { SerAppService } from '@core/modules/ser-engine/provider/ser-app.provider';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// @todo move interface to core
import { IQlikApp } from '@apps/api/app.interface';
import { SerApp } from '@core/modules/ser-app/model/app.model';
import { ReportModel } from '@core/modules/ser-report/model/report.model';
import { SerScriptService } from '@core/modules/ser-script/provider/ser-script.provider';
import { ISerScriptData } from '@core/modules/ser-script/api/ser-script-data.interface';
import { defaultScript } from '@core/modules/ser-script/data/default-script';
import { ReportService } from '@core/modules/ser-report/services/report.service';
import { ISerApp } from '../api/ser-app.interface';

@Injectable()
export class SerAppManagerService {

    private loadedApps: BehaviorSubject<IQlikApp[]> ;
    private loadedSerApps: BehaviorSubject<IQlikApp[]> ;
    private selectedApps: IQlikApp[];
    private isAppsLoaded = false;
    private isSerAppsLoaded = false;
    private reportService: ReportService;
    private serAppService: SerAppService;
    private serScriptService: SerScriptService;
    private openApps: WeakMap<ISerApp, EngineAPI.IApp>;
    private isLoadingApps = false;
    private isLoadingSerApps = false;

    constructor(
        serAppService: SerAppService,
        scriptService: SerScriptService,
        reportService: ReportService
    ) {
        this.serAppService    = serAppService;
        this.serScriptService = scriptService;
        this.reportService    = reportService;
        this.openApps         = new WeakMap<ISerApp, EngineAPI.IApp>();

        this.loadedApps    = new BehaviorSubject<IQlikApp[]>([]);
        this.loadedSerApps = new BehaviorSubject<IQlikApp[]>([]);

        this.selectedApps    = [];
    }

    /**
     * closes an opened ser app
     *
     * @param {ISerApp} app
     * @memberof SerAppManagerService
     */
    public closeApp(app: ISerApp) {

        if (this.openApps.has(app)) {
            this.openApps.get(app).session.close();
            this.openApps.delete(app);
        }
    }

    /**
     * create new app
     *
     * @param {string} name
     * @returns {Observable<ISerApp>}
     * @memberof SerAppManagerService
     */
    public createApp(name: string): Observable<ISerApp> {
        return this.serAppService.createApp(name)
        .pipe(
            switchMap( async (app) => {
                const script = await app.getScript();
                return {app, script};
            }),
            map( ( result ) => {
                // trigger new on serApps and apps
                return this.buildApp(result.app, `${result.script}${defaultScript}`);
            }),
            switchMap( async (serApp: ISerApp) => {

                serApp.script.script.tasks[0].reports[0] = (serApp.report as ReportModel).raw;
                const newScript = this.serScriptService.stringify(serApp.script);

                if ( this.openApps.has(serApp) ) {
                    const engineApp = this.openApps.get(serApp);
                    await engineApp.setScript(newScript);
                    await engineApp.doSave();
                }
                return serApp;
            })
        );
    }

    public getSelectedApps(): IQlikApp[] {
        return this.selectedApps;
    }

    /**
     * load all qlik apps
     *
     * @param {boolean} [force=false]
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppManagerService
     */
    public loadApps(force = false): Observable<IQlikApp[]> {

        if ( this.isAppsLoaded && ! force || this.isLoadingApps ) {
            return this.loadedApps;
        }

        this.isLoadingApps = true;
        // load apps
        return this.serAppService.fetchApps()
            .pipe(
                switchMap( (apps: IQlikApp[]) => {
                    this.isAppsLoaded  = true;
                    this.isLoadingApps = false;
                    this.loadedApps.next(apps);
                    return this.loadedApps;
                })
            );
    }

    /**
     * load only ser apps
     *
     * @param {boolean} [force=false]
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppManagerService
     */
    public loadSerApps(force = false): Observable<IQlikApp[]> {

        if ( (this.isSerAppsLoaded && ! force) || this.isLoadingSerApps ) {
            return this.loadedSerApps;
        }

        this.isLoadingSerApps = true;

        // load apps
        return this.serAppService.fetchSenseExcelReportingApps()
            .pipe(
                switchMap( (apps: IQlikApp[]) => {
                    this.isSerAppsLoaded = true;
                    this.isLoadingSerApps = false;
                    this.loadedSerApps.next(apps);
                    return this.loadedSerApps;
                })
            );
    }

    /**
     * open session to app to edit this
     *
     * @param {string} appId
     * @returns {Observable<EngineAPI.IApp>}
     * @memberof SerAppManagerService
     */
    public openApp(appId: string): Observable<ISerApp> {

        return this.serAppService.loadApp(appId)
        .pipe(
            switchMap( async (app) => {
                const script = await app.getScript();
                return {app, script};
            }),
            map( (result) => {
                const ret =  this.buildApp(result.app, result.script);
                return ret;
            })
        );
    }

    /**
     * save an app
     *
     * @param {ISerApp} app
     * @memberof SerAppManagerService
     */
    public async saveApp(app: ISerApp): Promise<void> {

        const report = this.cleanUpReportData((app.report as ReportModel).raw);
        app.script.script.tasks[0].reports[0] = report;
        const newScript = this.serScriptService.stringify(app.script);

        if ( this.openApps.has(app) ) {
            const qApp = this.openApps.get(app);
            await qApp.setScript(newScript);
            await qApp.doSave();
        }
    }

    /**
     * set selected apps
     *
     * @param {IQlikApp[]} apps
     * @memberof SerAppManagerService
     */
    public selectApps(apps: IQlikApp[]) {
        this.selectedApps = apps;
    }

    /**
     * build sense excel reporting app
     *
     * @private
     * @param {EngineAPI.IApp} app
     * @param {string} script
     * @returns {ISerApp}
     * @memberof SerAppManagerService
     */
    private buildApp(app: EngineAPI.IApp, script: string): ISerApp {

        const scriptData: ISerScriptData  = this.serScriptService.parse(script);
        const reports = this.serScriptService.extractReports(scriptData);
        const report  = this.reportService.createReport(reports[0]);

        const serApp  = new SerApp();
        serApp.script = scriptData;
        serApp.appId  = app.id;
        serApp.report = report;

        this.openApps.set(serApp, app);
        return serApp;
    }

    private cleanUpReportData(report: any) {
        const data = report;
        for (const key in data) {
            if ( ! data.hasOwnProperty(key) ) {
                continue;
            }
            const value = data[key];
            if ( value && Object.prototype.toString.apply(value).slice(8, -1) === 'Object') {
                const cleaned = this.cleanUpReportData(data[key]);
                if ( Object.keys(cleaned).length === 0 ) {
                    delete data[key];
                }
            } else {
                if ( data[key] === undefined ) {
                    delete data[key];
                }
            }
        }
        return data;
    }
}
