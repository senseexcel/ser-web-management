import { create } from 'enigma.js';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { IQlikApp } from '@qlik/api/app.interface';
import { from, Subject, Observable, forkJoin, empty } from 'rxjs';
import { mergeMap, switchMap, catchError, filter, buffer, map } from 'rxjs/operators';
import { ISerReport, ISerConfig } from '@ser-app/api';
import { IQlikAppCreated } from '@ser-app/api/response.api';

export class SerAppProvider {

    private createSession(appId = 'engineData'): Promise<enigmaJS.ISession> {
        return new Promise<enigmaJS.ISession>((resolve) => {
            const baseUrl = `wss://nb-fc-207990/app/${appId}`;

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

            const session: enigmaJS.ISession = create(configEnigma);
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

    public fetchSenseExcelReportingApps(): Observable<IQlikApp[]> {

        return from(this.fetchApps()).pipe(
            switchMap( (apps: IQlikApp[]) => {
                return this.getSerApps(apps);
            }),
            catchError( (error) => {
                return [];
            })
        );
    }

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

    public loadApp(appId: string): Observable<EngineAPI.IApp> {

        return from(this.createSession(appId))
            .pipe(
                switchMap( async (session) => {
                    const global = await session.open() as any;
                    return await global.openDoc(appId, '', '', '', true);
                })
            );
    }

    public createApplication(appName: string): Observable<any> {

        return from([1]);
        /*
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
        */
    }

    public createSerConfig(report: ISerReport): ISerConfig {
        const config: ISerConfig = {
            tasks: [
                { reports: [report] }
            ]
        };
        return config;
    }
}
