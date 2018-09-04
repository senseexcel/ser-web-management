import { create } from 'enigma.js';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import * as hjson from 'hjson';
import { IQlikApp } from '@qlik/api/app.interface';
import { from, Subject, Observable } from 'rxjs';
import { mergeMap, switchMap, catchError, filter, buffer, map, bufferCount } from 'rxjs/operators';
import { ISERApp } from '@qlik/api/ser.response.interface';
import { IScriptData } from '@qlik/api/script-data.interface';

export class SerAppProvider {

    private createSession(appId = 'engineData'): Promise<enigmaJS.ISession> {
        return new Promise<enigmaJS.ISession>((resolve) => {
            const baseUrl = `wss://desktop-tphgv43/app/${appId}`;

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

    public fetchApps() {

        return from(this.createSession()).pipe(
            mergeMap( (session) => {
                return session.open()
                    .then( (global: any) => {
                        return global.getDocList();
                    });
            })
        );
    }

    public fetchSenseExcelReportingApps() {

        return from(this.fetchApps()).pipe(
            // get scripts
            switchMap( (apps: IQlikApp[]) => {
                return this.getSERApps(apps);
            }),
            catchError( (error) => {
                return [];
            })
        );
    }

    private getSERApps(apps): Observable<ISERApp[]> {

        const need = apps.length;
        const appsLoaded: Subject<boolean> = new Subject();
        let get = 0;

        return from(apps).pipe(
            mergeMap( (app: IQlikApp) => {

                return this.createSession(app.qDocId)
                    .then( async (session) => {

                        const global   = await session.open() as any;
                        const qApp: EngineAPI.IApp = await global.openDoc(app.qDocId, '', '', '', true);
                        const layout   = await qApp.getAppLayout();
                        const script   = await qApp.getScript();
                        await qApp.session.close();

                        if ( (++get) === need ) {
                            appsLoaded.next(true);
                        }

                        return {
                            qapp: app,
                            name  : layout.qTitle,
                            script: script,
                        };
                    })
                    .catch( async (error) => {

                        if ( (++get) === need ) {
                            appsLoaded.next(true);
                        }

                        return { qapp: null, name: 'error', script: '' };
                    });
            }),
            filter( (appData) => {
                return appData.script.indexOf('SER.START') !== -1;
            }),
            buffer( appsLoaded ),
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

    public closeApp(app: EngineAPI.IApp) {
        // @todo implement
    }

    public parseScript(script): IScriptData {

        const indexStart = script.indexOf('SER.START');
        if ( indexStart === -1 ) {
            throw new Error('no ser data available');
        }

        const taskNamePattern = new RegExp(`SER\.START.*?\\((.*?)\\)`);
        const taskName = script.match(taskNamePattern)[1];
        const jsonPattern = new RegExp(`SET\\s*${taskName}.*?´([^´]+)`, 'm');

        const result = jsonPattern.exec(script);

        const start = script.indexOf(result[1]);
        const end   = start + result[1].length;

        return {
            after    : script.substr(end),
            before   : script.substr(0, start),
            serConfig: hjson.parse(result[1])
        };
    }
}
