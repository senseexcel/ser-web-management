import { Inject } from '@angular/core';
import { IQlikApp } from '@apps/api/app.interface';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import { from, Observable } from 'rxjs';
import { mergeMap, switchMap, catchError, filter, buffer, map } from 'rxjs/operators';
import { IQlikAppCreated } from '../api/response/app-created.interface';
import { ISerEngineConfig } from '../api/ser-engine-config.interface';
import { IQrsFilter } from '@core/modules/ser-engine/api/filter.interface';
import { HttpParams, HttpClient } from '@angular/common/http';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { CustomPropertyProvider } from './custom-property.providert';
import { IQrsApp } from '../api/response/qrs/app.interface';

export class SerAppService {

    private senseConfig: ISerEngineConfig;
    private filterService: any;
    private customPropertyProvider: CustomPropertyProvider;
    private httpClient: any;

    public constructor(
        @Inject('SerEngineConfig') senseConfig: ISerEngineConfig,
        httpClient: HttpClient,
        qrsFilterService: SerFilterService,
        customPropertyService: CustomPropertyProvider
    ) {
        this.senseConfig   = senseConfig;
        this.filterService = qrsFilterService;
        this.httpClient    = httpClient;
        this.customPropertyProvider = customPropertyService;
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
     * filters all given apps for sense excel reporting apps
     *
     * @private
     * @param {IQlikApp[]} apps
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    public fetchSerApps(): Observable<IQrsApp[]> {

        const url = `/${this.senseConfig.virtualProxy}qrs/app/full/`;
        const appFilter = this.filterService.createFilter(
            'customProperties.value',
            `'sense-excel-reporting-app'`
        );

        return this.httpClient.get(url, {
            params: {
                filter: this.filterService.createFilterQueryString(appFilter)
            }
        });
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
                    customProperties: [{
                        value: 'sense-excel-reporting-app',
                        definition: data[1][0]
                    }],
                    schemaPath: 'CustomPropertyValue'
                };

                return this.httpClient.put(`/qrs/app/${newApp.id}`, updateData).toPromise();
            })
            .then(() => {
                return app;
            });
    }
}
