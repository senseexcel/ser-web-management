//#region imports

import { IDisplayApp } from "./utils";
import { SERApp } from "./serApp";

//#endregion

export class SERAppManagerController {

    public appList: IDisplayApp[] = [];
    public contentLibList: EngineAPI.IContentLibraryList;
    public contentList: EngineAPI.IStaticContentList;

    private timeout: ng.ITimeoutService;



    global: EngineAPI.IGlobal;
    selectedApp: EngineAPI.IApp;
    serApp: SERApp;

    appName: string;
    appReferenceName: string;
    contentLib: string;
    content: string;
    output: string;
    mode: string;
    connections: string;

    // serReport: SERReport;

    constructor(global: EngineAPI.IGlobal, timeout: ng.ITimeoutService) {
        console.log("Constructor called: SERAppManagerController");

        this.global = global;
        this.timeout = timeout;

        this.serApp = new SERApp(global);
        this.init()
        .then(() => {
            this.timeout();
        })
        .catch((error) => {
            console.error("ERROR in constructor of SERAppManagerController");
        });
    }

    /**
     * init
     */
    private init(): Promise<void> {
        console.log("fcn called: init - SERAppManagerController");

        return new Promise((resolve, reject) => {
            this.serApp.initApp()
            .then(() => {
                let arrProm = [];
                arrProm.push(this.getAppList());
                arrProm.push(this.loadContentLibForOpenApp());
                return Promise.all(arrProm);
            })
            .then((res) => {
                this.appList = res[0];
                this.contentLibList = res[1];
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * getAppList: creates an array of application information
     */
    private getAppList(): Promise<IDisplayApp[]> {
        console.log("fcn called: get AppList - SERAppManager");

        return new Promise((resolve, reject) => {
            this.global.getDocList()
            .then((docList) => {
                let apps: IDisplayApp[] = [];
                for (const doc of docList) {
                    console.log("fcn called: get AppList - app:", doc.qDocName);
                    let app: IDisplayApp = {
                        id: doc.qDocId,
                        name: doc.qDocName
                    };
                    apps.push(app);
                }
                resolve(apps);
            })
            .catch((error) => {
                console.error("ERROR in getAppList", error);
                reject(error);
            });
        });
    }

    /**
     * getContentLibForOpenApp
     */
    private loadContentLibForOpenApp(): Promise<EngineAPI.IContentLibraryList> {
        console.log("fcn called: loadContentLibForOpenApp - SERAppManagerController");

        return new Promise((resolve, reject) => {
            this.serApp.getContentLibraries()
            .then((contentLibraries) => {
                resolve(contentLibraries);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * loadContentForLib
     */
    public loadContentForLib(libName: string): Promise<void> {
        console.log("fcn called: loadContentForLib - SERAppManagerController");

        return new Promise((resolve, reject) => {
            this.serApp.loadContentForLib(libName)
            .then((content) => {
                this.contentList = content;
                this.timeout();
            })
            .catch((error) => {
                console.error("ERROR in loadContentForLib", error);
                reject(error);
            });
        });
    }

    /**
     * selectContentFromLibrarie
     */
    public selectContentFromLibrarie(libraryName: string): Promise<EngineAPI.IStaticContentList> {
        console.log("fcn called: selectContentFromLibrarie - SERAppManagerController");

        return new Promise((resolve, reject) => {
            this.serApp.app.getLibraryContent(libraryName)
            .then((content) => {
                resolve(content);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * createSerApp
     */
    public createSerApp() {
        console.log("fcn called: createSerApp - SERAppManagerController");

        let arrProm: Promise<any>[] = [];

        arrProm.push(this.serApp.setAppName(this.appName));
        arrProm.push(this.serApp.createSerScript(this.appReferenceName, this.contentStringNormalizer(this.content)));

        Promise.all(arrProm)
        .catch((error) => {
            console.error("ERROR", error);
        });
    }

    private contentStringNormalizer(content: string): string {
        console.log("fcn called: contentStringNormalizer - SERAppManagerController");
        try {
            let stringArr = content.split("/");
            return `${stringArr[1]}://${stringArr[2]}/${stringArr[3]}`;
        } catch (error) {
            console.error("Error", error);
        }
    }

}