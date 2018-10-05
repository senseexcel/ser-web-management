import { Inject } from '@angular/core';
import { IQlikApp } from '@apps/api/app.interface';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import { from, Subject, Observable, of } from 'rxjs';
import { mergeMap, switchMap, catchError, filter, buffer, map, bufferCount } from 'rxjs/operators';
import { IQlikAppCreated } from '../api/response/app-created.interface';
import { ISerEngineConfig } from '../api/ser-engine-config.interface';
import { IQrsFilter } from '@core/modules/ser-engine/api/filter.interface';
import { HttpParams, HttpClient } from '@angular/common/http';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';

export class SerAppService {

    private senseConfig: ISerEngineConfig;
    private filterService: any;
    private httpClient: any;

    public constructor(
        @Inject('SerEngineConfig') senseConfig: ISerEngineConfig,
        httpClient: HttpClient,
        qrsFilterService: SerFilterService
    ) {
        this.senseConfig   = senseConfig;
        this.filterService = qrsFilterService;
        this.httpClient    = httpClient;
    }

    private createSession(appId = 'engineData'): Promise<enigmaJS.ISession> {

        return new Promise<enigmaJS.ISession>((resolve) => {
            const url = buildUrl({
                host: this.senseConfig.host,
                secure: true,
                appId,
                identity: Math.random().toString(32).substr(2)
            });

            const session: enigmaJS.ISession = create({
                schema: qixSchema,
                url
             });

            resolve(session);
        });
    }

    public fetchApps(): Observable<any[]> {

        return from(this.createSession()).pipe(
            mergeMap( (session) => {
                return session.open()
                    .then( (global: any) => {
                        return global.getDocList() as IQlikApp[];
                    });
            })
        );
    }

    /**
     * get all sense excel reporting apps
     *
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    public fetchSenseExcelReportingApps(): Observable<IQlikApp[]> {

        return from(this.fetchApps()).pipe(
            mergeMap( (apps: IQlikApp[]) => {
                return this.getSerApps(apps);
            }),
            catchError( (error) => {
                console.log(error);
                return [];
            })
        );
    }

    /**
     * fetch current number of all sense excel apps
     *
     * @returns {Observable<number>}
     * @memberof SerTaskService
     */
    public fetchAppCount(qrsFilter?: IQrsFilter): Observable<number> {

        const url = `/${this.senseConfig.virtualProxy}qrs/App/count`;
        let params: HttpParams = new HttpParams();

        if (qrsFilter) {
            params = params.set('filter', this.filterService.createFilterQueryString(qrsFilter));
        }

        return this.httpClient.get(url, {params})
            .pipe(
                map((response: {value: number}) => {
                    return response.value;
                })
            );
    }

    /**
     * filters all given apps for sense excel reporting apps
     *
     * @private
     * @param {IQlikApp[]} apps
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    private getSerApps(apps: IQlikApp[]): Observable<IQlikApp[]> {

        const need = apps.length;
        const appsLoaded: Subject<boolean> = new Subject<boolean>();
        let appsChecked  = 0;

        return from(apps).pipe(
            mergeMap((app: IQlikApp) => {
                return this.createSession(app.qDocId)
                    .then( async (session) => {

                        const global = await session.open() as any;
                        const qApp: EngineAPI.IApp = await global.openDoc(app.qDocId, '', '', '', true);
                        const script = await qApp.getScript();
                        await qApp.session.close();

                        return {
                            qapp: app,
                            script
                        };
                    })
                    .catch((error) => {
                        return null;
                    });
            }),
            filter((appData: any) => {
                appsChecked++;

                if ( appsChecked === need ) {
                    appsLoaded.next(true);
                }

                if ( ! appData ) {
                    return false;
                }
                const config = appData.script as string;
                return config && config.indexOf('SER.START') !== -1;
            }),
            map((data): IQlikApp => {
                return data.qapp;
            }),
            buffer(appsLoaded)
        );
    }

    /**
     * load existing app by id
     *
     * @param {string} appId
     * @returns {Observable<EngineAPI.IApp>}
     * @memberof SerAppService
     */
    public loadApp(appId: string): Observable<EngineAPI.IApp> {

        return from(this.createSession(appId))
            .pipe(
                switchMap( async (session) => {
                    const global = await session.open() as any;
                    return await global.openDoc(appId, '', '', '', true);
                })
            );
    }

    /**
     * create new app
     *
     * @param {string} appName
     * @returns {Observable<any>}
     * @memberof SerAppService
     */
    public createApp(appName: string): Observable<any> {

        return from(this.createSession())
        .pipe(
            mergeMap( async (session: enigmaJS.ISession) => {
                const global  = await session.open() as any;
                const newApp = await global.createApp(appName, 'main') as IQlikAppCreated;

                return {
                    global,
                    newApp
                };
            }),
            switchMap((response) => {
                return response.global.openDoc(response.newApp.qAppId, '', '', '', true);
            })
        );
    }
}
