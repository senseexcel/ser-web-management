import { Injectable, Inject } from '@angular/core';
import { SerAppService } from '@core/modules/ser-engine/provider/ser-app.provider';
import { BehaviorSubject, Observable, concat, from, empty, of } from 'rxjs';
import { switchMap, map, filter, concatAll, mergeMap, concatMap, tap, catchError, bufferCount, takeUntil } from 'rxjs/operators';
// @todo move interface to core
import { IQlikApp } from '@apps/api/app.interface';
import { SerApp } from '@core/modules/ser-app/model/app.model';
import { ReportModel } from '@core/modules/ser-report/model/report.model';
import { SerScriptService } from '@core/modules/ser-script/provider/ser-script.provider';
import { ISerScriptData } from '@core/modules/ser-script/api/ser-script-data.interface';
import { defaultScript } from '@core/modules/ser-script/data/default-script';
import { ReportService } from '@core/modules/ser-report/services/report.service';
import { ISerApp } from '../api/ser-app.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { IQrsApp } from '@core/modules/ser-engine/api/response/qrs/app.interface';
import { AppData } from '@core/model/app-data';
import { InvalidReportException } from '@core/modules/ser-report/api/exceptions/invalid-report.exceptio';

@Injectable()
export class SerAppManagerService {

    private loadedApps$: BehaviorSubject<IQlikApp[]> ;
    private loadedSerApps$: BehaviorSubject<IQlikApp[]> ;

    private loadedApps: IQlikApp[]    = [];
    private loadedSerApps: IQlikApp[] = [];
    private selectedApps: IQlikApp[];
    private isAppsLoaded = false;
    private isSerAppsLoaded = false;
    private reportService: ReportService;
    private serAppService: SerAppService;
    private serScriptService: SerScriptService;
    private taskService: SerTaskService;
    private openApps: WeakMap<ISerApp, EngineAPI.IApp>;
    private isLoadingApps = false;
    private isLoadingSerApps = false;

    constructor(
        @Inject('AppData') appData: AppData,
        serAppService: SerAppService,
        scriptService: SerScriptService,
        reportService: ReportService,
        taskService: SerTaskService
    ) {
        this.serAppService    = serAppService;
        this.serScriptService = scriptService;
        this.reportService    = reportService;
        this.taskService      = taskService;
        this.openApps         = new WeakMap<ISerApp, EngineAPI.IApp>();

        this.loadedApps    = [];
        this.loadedSerApps = [];

        this.loadedApps$    = new BehaviorSubject<IQlikApp[]>(this.loadedApps);
        this.loadedSerApps$ = new BehaviorSubject<IQlikApp[]>(this.loadedSerApps);

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
    public async createApp(name: string): Promise<ISerApp> {

        const app    = await this.serAppService.createApp(name);
        const script = await app.getScript();

        const serApp = this.buildApp(app, `${script}${defaultScript}`);
        const newScript = this.serScriptService.stringify(serApp.script);

        if (this.openApps.has(serApp)) {
            const engineApp = this.openApps.get(serApp);
            await engineApp.setScript(newScript);
            await engineApp.doSave();
        }

        serApp.title = name;
        const appData = await this.fetchApp(serApp.appId).toPromise();

        this.loadedSerApps.push(appData);
        this.loadedApps.push({ qDocName: serApp.title, qDocId: serApp.appId });

        this.loadedApps$.next(this.loadedApps);
        this.loadedSerApps$.next(this.loadedSerApps);

        return serApp;
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
            return this.loadedApps$;
        }

        this.isLoadingApps = true;
        // load apps
        return this.serAppService.fetchApps()
            .pipe(
                switchMap( (apps: IQlikApp[]) => {
                    this.isAppsLoaded  = true;
                    this.isLoadingApps = false;
                    this.loadedApps = apps;
                    this.loadedApps$.next(this.loadedApps);
                    return this.loadedApps$;
                })
            );
    }

    public fetchApp(appId: string): Observable<IQlikApp> {
        const source$ = this.serAppService.fetchApp(appId)
            .pipe(
                map((app: IQrsApp) => {
                    const qApp: IQlikApp = {
                        source: app,
                        qDocId: app.id,
                        qDocName: app.name,
                        qTitle: app.name
                    };
                    return qApp;
                })
            );

        return source$;
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
            return this.loadedSerApps$;
        }

        this.isLoadingSerApps = true;

        // load apps
        return this.serAppService.fetchSerApps()
            .pipe(
                map((apps: IQrsApp[]): IQlikApp[] => {
                    return apps.map((app: IQrsApp): IQlikApp => {
                        const qApp: IQlikApp = {
                            source: app,
                            qDocId: app.id,
                            qDocName: app.name,
                            qTitle: app.name
                        };
                        return qApp;
                    });
                }),
                switchMap( (apps: IQlikApp[]) => {
                    this.isSerAppsLoaded = true;
                    this.isLoadingSerApps = false;
                    this.loadedSerApps = apps;
                    this.loadedSerApps$.next(this.loadedSerApps);
                    return this.loadedSerApps$;
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
    public openApp(qapp: IQlikApp): Observable<ISerApp> {

        return this.serAppService.loadApp(qapp.qDocId)
        .pipe(
            switchMap( async (app) => {
                const script = await app.getScript();
                return {app, script};
            }),
            map((result) => {
                const serApp =  this.buildApp(result.app, result.script);
                serApp.title = qapp.qDocName;
                return serApp;
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

        const report = this.reportService.cleanReport((app.report as ReportModel).raw);
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

    public getAppTasks(appId: string): Observable<ITask[]> {
        return this.taskService.fetchTasksForApp(appId);
    }

    /**
     * add existing SER tag to app
     *
     * @memberof SerAppManagerService
     */
    public updateSerAppsWithTag() {
        return this.serAppService.fetchSerApps(false, true)
            .pipe(
                switchMap((apps) => {
                    if (apps.length) {
                        return from(apps)
                            .pipe(
                                concatMap(app => this.serAppService.addTagToApp(app)),
                                bufferCount(apps.length)
                            );
                    }
                    return of([]);
                }),
            );
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
        const serApp  = new SerApp();
        try {
            const scriptData: ISerScriptData  = this.serScriptService.parse(script);
            const reports = this.serScriptService.extractReports(scriptData);
            const report  = this.reportService.createReport(reports[0]);

            serApp.script  = scriptData;
            serApp.appId   = app.id;
            serApp.report  = report;
            serApp.invalid = false;

            this.openApps.set(serApp, app);

        } catch (error) {
            if (error instanceof InvalidReportException) {
                serApp.invalid = true;
                return serApp;
            } else {
                throw error;
            }
        }
        return serApp;
    }
}
