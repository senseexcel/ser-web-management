//#region imports
import { throws }               from "assert";
import { Connection }           from "./connection";
import { SERApp }               from "./serApp";
import { IAppListEntry,
         ESERReportSections,
         ISERReportExtend }     from "./utils";
//#endregion

export class SERFetchAppsManagerController {

    //#region variables
    public timeout: ng.ITimeoutService;
    public global: EngineAPI.IGlobal;
    public appList: IAppListEntry[] = [];
    public serApp: SERApp;
    public serReport: ISERReportExtend;
    public showSerReportContent: boolean = false;
    public showSerReportConnection:boolean = false;
    public showSerReportTemplate:boolean = false;
    public showSerReportDistribution:boolean = false;
    public showSerReportGeneral:boolean = false;
    public showFetchAppRegion: boolean = false;
    public session: enigmaJS.ISession;
    //#endregion

    constructor(timeout: ng.ITimeoutService) {
        console.log("Constructor called: SERFetchAppsManagerController");

        this.timeout = timeout;
        let connection = new Connection();
        connection.createSession()
        .then((session) => {
            this.session = session;
            return session.open();
        })
        .then((global: EngineAPI.IGlobal) => {
            this.global = global;
            return this.fetchAllAppsWithSer();
        })
        .then(() => {
            this.showFetchAppRegion = true;
            this.timeout();
        })
        .catch((error) => {
            console.error("ERROR in Constructor of SERManagerController", error);
        });
    }

    /**
     * fetchAllAppsWithSer
     */
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
    }

    /**
     * getAppIdWithSerCall
     * @param appId
     */
    getAppIdWithSerCall(appId: string): Promise<IAppListEntry> {
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

    /**
     * analyseScript
     * @param app
     */
    analyseScript(app: EngineAPI.IApp): Promise<IAppListEntry> {
        return new Promise((resolve, reject) => {
            let appName: string;
            let appId: string = app.id;

            app.getAppLayout()
            .then((layout) => {
                appName = layout.qTitle;
                return app.getScript();
            })
            .then((script) => {
                console.log("Serch script: ###########" + appName + "##############", script.indexOf("SER.START"));

                if (script.indexOf("SER.START") !== -1) {
                    let appListEntry: IAppListEntry = {
                        appId: appId,
                        appName: appName
                    };
                    resolve(appListEntry);
                }
                resolve(null);
            });
        });
    }

    /**
     * changeApplication
     * @param appId
     */
    changeApplication(appId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let connection: Connection = new Connection();
            connection.createUniqSession(appId)
            .then((session) => {
                return session.open();
            })
            .then((global: EngineAPI.IGlobal)=> {
                this.serApp = new SERApp(global);
                return global.openDoc(appId, "", "", "", true);
            })
            .then((app) => {
                return this.serApp.initApp(app);
            })
            .then(() => {
                return this.serApp.setSerContent();
            })
            .then(() => {
                return this.serApp.getSerContent();
            })
            .then((serReport) => {
                this.serReport = serReport;
                this.showSerReportContent = true;
                this.timeout();
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * openReportSection
     * @param section
     */
    openReportSection(section: string) {
        this.showSerReportConnection = false;
        this.showSerReportTemplate = false;
        this.showSerReportDistribution = false;
        this.showSerReportGeneral = false;
        switch (ESERReportSections[section]) {
            case ESERReportSections.Connection:
                this.showSerReportConnection = true;
                break;
            case ESERReportSections.Distribution:
                this.showSerReportDistribution = true;
                break;
            case ESERReportSections.General:
                this.showSerReportGeneral = true;
                break;
            case ESERReportSections.Template:
                this.showSerReportTemplate = true;
                break;
        }
        console.log("##############", this.serReport);
        this.timeout();
    }

    /**
     * applyChanges
     */
    applyChanges() {
        this.serApp.setFullPropertys(this.serReport)
        .then(() => {
            this.serApp.createSerScript();
        })
        .then(() => {
            //
        })
        .catch((error) => {
            console.log(error);
        });
    }
}