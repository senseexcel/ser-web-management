import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { IQlikApp } from '@apps/api/app.interface';
import { from, Subject, Observable } from 'rxjs';
import { mergeMap, switchMap, catchError, filter, buffer, map } from 'rxjs/operators';
import { IQlikAppCreated } from '../api/response/app-created.interface';

export class SerAppService {

    private createSession(appId = 'engineData'): Promise<enigmaJS.ISession> {
        return new Promise<enigmaJS.ISession>((resolve) => {
            const baseUrl = `wss://desktop-tphgv43/app/${appId}`;

            const myUrl = buildUrl({
                host: 'desktop-tphgv43',
                appId,
                identity: Math.random().toString(32).substr(2)
            });

            const session: enigmaJS.ISession = create({ schema: qixSchema, url: myUrl });

            /* it seems we dont need this
            const configEnigma = {
                Promise,
                schema: qixSchema,
                mixins: [{
                    types: ['GenericObject'],
                    init: function init(properties: any) {
                        properties.api.app = properties.api.session.getObjectApi({
                            handle: 1,
                            id: 'Doc',
                            type: 'Doc',
                            customType: 'Doc',
                            delta: true
                        });
                    }
                }],
                url: baseUrl
            };
            */

            resolve(session);
        });
    }

    public fetchApps(): Observable<IQlikApp[]> {

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
            switchMap( (apps: IQlikApp[]) => {
                return this.getSerApps(apps);
            }),
            catchError( (error) => {
                console.log(error);
                return [];
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
        const appsLoaded: Subject<boolean> = new Subject();
        let get = 0;

        return from(apps).pipe(
            mergeMap((app: IQlikApp) => {

                return this.createSession(app.qDocId)
                    .then( async (session) => {

                        const global   = await session.open() as any;
                        const qApp: EngineAPI.IApp = await global.openDoc(app.qDocId, '', '', '', true);
                        const script   = await qApp.getScript();
                        await qApp.session.close();

                        if ( (++get) === need ) {
                            appsLoaded.next(true);
                        }

                        return {
                            qapp: app,
                            script
                        };
                    })
                    .catch((error) => {
                        // @todo handle error
                        if ( (++get) === need ) {
                            appsLoaded.next(true);
                        }
                        return null;
                    });
            }),
            filter((appData: any) => {
                if ( ! appData ) {
                    return false;
                }
                const config = appData.script as string;
                return config && config.indexOf('SER.START') !== -1;
            }),
            map((data): IQlikApp => {
                return data.qapp;
            }),
            buffer( appsLoaded )
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
