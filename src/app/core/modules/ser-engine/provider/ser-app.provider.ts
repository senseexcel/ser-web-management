import { Inject } from '@angular/core';
import { IQlikApp } from '@apps/api/app.interface';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import { from, Observable, merge, of } from 'rxjs';
import { mergeMap, switchMap, map, concatMap, bufferCount, tap } from 'rxjs/operators';
import { IQlikAppCreated } from '../api/response/app-created.interface';
import { ISerEngineConfig } from '../api/ser-engine-config.interface';
import { IQrsFilter } from '@core/modules/ser-engine/api/filter.interface';
import { HttpParams, HttpClient } from '@angular/common/http';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { CustomPropertyProvider } from './custom-property.providert';
import { IQrsApp } from '../api/response/qrs/app.interface';
import { AppData } from '@core/model/app-data';
import { ITag } from '@core/api/tag.interface';

export class SerAppService {

    private senseConfig: ISerEngineConfig;
    private filterService: any;
    private customPropertyProvider: CustomPropertyProvider;
    private httpClient: any;
    private appData: AppData;

    public constructor(
        @Inject('SerEngineConfig') senseConfig: ISerEngineConfig,
        @Inject('AppData') appData: AppData,
        httpClient: HttpClient,
        qrsFilterService: SerFilterService,
        customPropertyService: CustomPropertyProvider
    ) {
        this.appData       = appData;
        this.customPropertyProvider = customPropertyService;
        this.filterService = qrsFilterService;
        this.httpClient    = httpClient;
        this.senseConfig   = senseConfig;
    }

    /**
     * create new session for app
     *
     * @private
     * @param {string} [appId='engineData']
     * @returns {Promise<enigmaJS.ISession>}
     * @memberof SerAppService
     */
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

    /**
     * filters all given apps for sense excel reporting apps
     *
     * @private
     * @param {IQlikApp[]} apps
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    private fetchAppsByScript(apps: IQlikApp[]): Observable<IQrsApp[]> {

        let requiredApps = apps.length;

        if (!apps.length) {
            return of([]);
        }

        return from(apps).pipe(
            concatMap((app: IQlikApp) => {
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
                        console.log(error.message);
                        return null;
                    });
            }),
            switchMap((app) => {
                const config   = app ? app.script as string : null;
                const isSerApp = config && config.indexOf('SER.START') !== -1;

                if (isSerApp) {
                    return this.fetchApp(app.qapp.qDocId);
                }

                requiredApps--;
                return of(null);
            }),
            bufferCount(requiredApps),
            map((result) => {
                return result.filter(app => app !== null);
            })
        );
    }

    /**
     * fetch all apps
     *
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    public fetchApps(excludeTag: boolean = false): Observable<IQlikApp[]> {

        const url = `/${this.senseConfig.virtualProxy}qrs/app/full/`;
        let source$ = this.httpClient.get(url);

        /** filter all apps which allready have the tag */
        if (excludeTag) {
            source$ = source$.pipe(
                map((apps: IQrsApp[]) => {
                    return apps.filter((app) => {
                        for (let i = 0, ln = app.tags.length; i < ln; i++) {
                            const tag: ITag = app.tags[i];
                            if ( tag.id === this.appData.tag.id ) {
                                return false;
                            }
                        }
                        return true;
                    });
                })
            );
        }

        /** convert qrs app into qlik app */
        source$ = source$.pipe(
            map((apps: IQrsApp[]): IQlikApp[] => {
                return apps.map((app: IQrsApp): IQlikApp => {
                    return {
                        qDocId  : app.id,
                        qDocName: app.name,
                        qTitle  : app.name
                    };
                });
            })
        );

        return source$;
    }

    /**
     * get app by id
     *
     * @param {string} id
     * @returns {Observable<IQrsApp>}
     * @memberof SerAppService
     */
    public fetchApp(id: string): Observable<IQrsApp> {
        const url = `/qrs/app/${id}`;
        return this.httpClient.get(url);
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
     *  fetch all sense excel reporting apps
     *
     * @private
     * @param {IQlikApp[]} apps
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    public fetchSerApps(useTag = true, excludeTag: boolean = false): Observable<IQrsApp[]> {

        let source$;

        if (this.appData.tag && useTag) {
            // filter apps by tag if exists fast way
            const url = `/${this.senseConfig.virtualProxy}qrs/app/full/`;
            const appFilter = this.filterService.createFilter(
                'tags.id', this.appData.tag.id
            );
            source$ = this.httpClient.get(url, {
                params: {
                    filter: this.filterService.createFilterQueryString(appFilter)
                }
            });
        } else {
            // fetch by script (slow way)
            source$ = this.fetchApps(excludeTag)
                .pipe(
                    mergeMap(apps => this.fetchAppsByScript(apps)),
                );
        }

        return source$;
    }

    public addTagToApp(app: IQrsApp) {
        const updateData = {
            modifiedDate: app.modifiedDate,
            tags: [
                ...app.tags, this.appData.tag
            ]
        };
        return this.httpClient.put(`/qrs/app/${app.id}`, updateData).toPromise();
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
    public createApp(appName: string): Promise<any> {

        let app;

        return this.createSession()
            .then((session: enigmaJS.ISession) => {
                return session.open();
            })
            .then(async (global: any) => {
                const newApp = await global.createApp(appName, 'main') as IQlikAppCreated;
                app          = await global.openDoc(newApp.qAppId, '', '', '', true);

                return Promise.all([
                    this.fetchApp(newApp.qAppId).toPromise(),
                    this.customPropertyProvider.fetchCustomProperties().toPromise()
                ]);
            }).
            then((data) => {
                const newApp = data[0];
                const updateData = {
                    modifiedDate: newApp.modifiedDate,
                };

                if (this.appData.tag) {
                    updateData['tags'] = [this.appData.tag];
                }

                return this.httpClient.put(`/qrs/app/${newApp.id}`, updateData).toPromise();
            })
            .then(() => {
                return app;
            });
    }
}
