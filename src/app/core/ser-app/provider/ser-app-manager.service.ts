import { Injectable } from '@angular/core';
import { SerAppService } from '@core/ser-engine/provider/ser-app.provider';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// @todo move interface to core
import { IQlikApp } from '@apps/api/app.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { SerApp } from '@core/ser-app/model/app.model';
import { ReportModel } from '@core/ser-report/model/report.model';
import { ConnectionModel } from '@core/ser-report/model/connection.model';
import { GeneralSettingsModel } from '@core/ser-report/model/settings/general-settings.model';
import { TemplateModel } from '@core/ser-report/model/template.model';
import { DeliveryModel } from '@core/ser-report/model/delivery.model';
import { SerScriptService } from '@core/ser-script/provider/ser-script.provider';
import { ISerScriptData } from '@core/ser-script/api/ser-script-data.interface';
import { defaultScript } from '@core/ser-script/data/default-script';
import { ISerApp } from '../api/ser-app.interface';

@Injectable()
export class SerAppManagerService {

    private loadedApps: BehaviorSubject<IQlikApp[]> ;

    private loadedSerApps: BehaviorSubject<IQlikApp[]> ;

    private selectedApps: SelectionModel<IQlikApp>;

    private isAppsLoaded = false;

    private isSerAppsLoaded = false;

    private serAppService: SerAppService;

    private serScriptService: SerScriptService;

    private openApps: WeakMap<ISerApp, EngineAPI.IApp>;

    constructor(
        serAppService: SerAppService,
        scriptService: SerScriptService
    ) {
        this.serAppService    = serAppService;
        this.serScriptService = scriptService;
        this.openApps         = new WeakMap<ISerApp, EngineAPI.IApp>();

        this.loadedApps    = new BehaviorSubject<IQlikApp[]>([]);
        this.loadedSerApps = new BehaviorSubject<IQlikApp[]>([]);
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
            map( (app: EngineAPI.IApp) => {
                // trigger new on serApps and apps
                return this.buildApp(app, defaultScript);
            })
        );
    }

    /**
     *
     *
     * @param {ISerApp} app
     * @memberof SerAppManagerService
     */
    public saveApp(app: ISerApp) {

        if ( this.openApps.has(app) ) {
            const qApp = this.openApps.get(app);
            qApp.doSave();
        }
    }

    /**
     * load only ser apps
     *
     * @param {boolean} [force=false]
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppManagerService
     */
    public loadSerApps(force = false): Observable<IQlikApp[]> {

        if ( this.isSerAppsLoaded && ! force ) {
            return this.loadedSerApps;
        }

        // load apps
        return this.serAppService.fetchSenseExcelReportingApps()
            .pipe(
                switchMap( (apps: IQlikApp[]) => {
                    this.isSerAppsLoaded = true;
                    this.loadedSerApps.next(apps);
                    return this.loadedSerApps;
                })
            );
    }

    /**
     * load all qlik apps
     *
     * @param {boolean} [force=false]
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppManagerService
     */
    public loadApps(force = false): Observable<IQlikApp[]> {

        if ( this.isAppsLoaded && ! force ) {
            return this.loadedApps;
        }

        // load apps
        return this.serAppService.fetchApps()
            .pipe(
                switchMap( (apps: IQlikApp[]) => {
                    this.isAppsLoaded = true;
                    this.loadedApps.next(apps);
                    return this.loadedApps;
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
                return this.buildApp(result.app, result.script);
            })
        );
    }

    /**
     * create new SerApp
     *
     * @private
     * @param {EngineAPI.IApp} app
     * @param {string} script
     * @returns {ISerApp}
     * @memberof SerAppManagerService
     */
    private buildApp(app: EngineAPI.IApp, script: string): ISerApp {

        const serApp = new SerApp();
        const scriptData: ISerScriptData  = this.serScriptService.parse(script);
        const reports = this.serScriptService.extractReports(scriptData);

        const report = new ReportModel();
        report.connections = reports[0].connections || new ConnectionModel();
        report.general     = reports[0].general     || new GeneralSettingsModel();
        report.template    = reports[0].template    || new TemplateModel();
        report.delivery    = reports[0].delivery    || new DeliveryModel();

        serApp.script = scriptData;
        serApp.appId  = app.id;
        serApp.report = report;

        this.openApps.set(serApp, app);
        return serApp;
    }
}
