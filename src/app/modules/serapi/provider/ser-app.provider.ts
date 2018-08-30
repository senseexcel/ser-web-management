import { create } from 'enigma.js';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { IQlikApp } from '@serEngine/api/app.interface';

export class SerAppProvider {

    public constructor () {
        console.log(qixSchema);
    }

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

    public async fetchApps(): Promise<IQlikApp[]> {

        try {
            const session: enigmaJS.ISession = await this.createSession();
            // @todo fixme typescript compiler not found Namespace EngineAPI
            // const global  = await session.open() as EngineAPI.IGlobal;
            const global  = await session.open() as any;
            const appList = await global.getDocList() as IQlikApp[];

            return appList;
        } catch ( error ) {
            throw new Error('something went terrible wrong');
        }
    }
        /*
    )
        .then(() => {
            this.showFetchAppRegion = true;
            this.timeout();
        })
        .catch((error) => {
            console.error("ERROR in Constructor of SERManagerController", error);
        });
        } catch ( error ) {
        }
    }

    /*
    fetchAllAppsWithSer() : Promise<void> {
        console.log("fcn called: fetchAllAppsWithSer - SERFetchAppsManagerController");

        return new Promise((resolve, reject) => {
            this.global.getDocList()
            .then((appList) => {
                let promArr: Promise<IAppListEntry>[] = [];
                let appListInner = (appList as any) as EngineAPI.IDocListEntry[];
                for (const iterator of appListInner) {
                    promArr.push(this.getAppIdWithSerCall(iterator.qDocId));
                }
                Promise.all(promArr)
                .then((arrAppEntry) => {

                    this.appList = arrAppEntry.reduce((f, i) => {
                        if (i!==null) {
                            f.push(i);
                        }
                        return f;
                    }, []);
                    resolve();
                })
                .catch((error) => {
                    Promise.reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
        */

        /*
    public getAppIdWithSerCall(appId: string): Promise<IAppListEntry> {
        console.log("fcn called: getAppIdWithSerCall - SERFetchAppsManagerController");

        return new Promise((resolve, reject) => {

            let appEntrySave: IAppListEntry;
            let sessionSave: enigmaJS.ISession;
            let connection: Connection = new Connection();
            connection.createUniqSession(appId)
            .then((session) => {
                sessionSave = session;
                return session.open();
            })
            .then((global: EngineAPI.IGlobal) => {
                return global.openDoc(appId, "", "", "", true);
            })
            .then((doc) => {
                console.log("doc", doc);
                return this.analyseScript(doc);
            })
            .then((appEntry) => {
                appEntrySave = appEntry;
                return sessionSave.close();
            })
            .then(() => {
                resolve(appEntrySave);
            })
            .catch((error) => {
                if(error.message.indexOf("App already open")!==-1) {
                    console.log("App already opnen");
                    this.global.getActiveDoc()
                    .then((doc: EngineAPI.IApp) => {
                        return this.analyseScript(doc);
                    })
                    .then((appEntry) => {
                        resolve(appEntry);
                    })
                    .catch((error) => {
                        reject(error);
                    });
                }
            });
        });
    }
    */
}
