//#region imports

import { ESERDistribute, ISERDistribute } from "./utils";
import { IDisplayApp, ISERHub, ISERFile, ISERMail } from "./utils";
import { ISerSenseSelection }               from "../node_modules/ser.api/index";
import { SERApp } from "./serApp";

//#endregion

export class SERAppManagerController {

    //#region variables
    public appList: IDisplayApp[] = [];
    public contentLibList: EngineAPI.IContentLibraryList;
    public contentList: EngineAPI.IStaticContentList;
    public connectionList: EngineAPI.IConnection[];
    public distribute: ISERHub | ISERFile | ISERMail;
    public serJson: string = "";
    public selection: ISerSenseSelection;
    public showDistributeRegion: boolean = false;
    public showCreateAppRegion: boolean = false;
    public showSelectionRegion: boolean = false;
    public global: EngineAPI.IGlobal;
    public selectedApp: EngineAPI.IApp;
    public serApp: SERApp;
    public appName: string;
    public appReferenceName: string;
    public contentLib: string;
    public content: string;
    public output: string;
    public mode: string;
    public connections: string;

    private distributeMode : string;
    private timeout: ng.ITimeoutService;
    //#endregion

    constructor(global: EngineAPI.IGlobal, timeout: ng.ITimeoutService, scope: ng.IScope) {
        console.log("Constructor called: SERAppManagerController");

        this.global = global;
        this.timeout = timeout;

        (scope as any).eSerDistribute = ESERDistribute;

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
                arrProm.push(this.loadConnections());
                return Promise.all(arrProm);
            })
            .then((res) => {
                this.appList = res[0];
                this.contentLibList = res[1];
                this.connectionList = res[2];
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
            .then((docList: any) => {
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
            this.serApp.getContentForLib(libName)
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
     * loadConnections
     */
    public loadConnections(): Promise<EngineAPI.IConnection[]> {
        console.log("fcn called: loadConnections - SERAppManagerController");

        return new Promise((resolve, reject) => {
            this.serApp.getConnections()
            .then((connections) => {
                console.log("connections", connections);
                resolve(connections);
            })
            .catch((error) => {
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
            this.serApp.getContentForLib(libraryName)
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
        .then(() => {
            this.showCreateAppRegion = false;
            this.timeout();
            this.global.session.close();
        })
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

    /**
     * showSerJson
     */
    public showSerJson() {
        console.log("fcn called: showSerJson - SERAppManagerController");
        this.serApp.getSerJson()
        .then((result) => {
            this.serJson = result;
        })
        .catch((error) => {
            console.error("ERROR in showJson", error);
        });
    }

    //#region distribute Section

    /**
     * addDistribution
     */
    public addDistribution(): void {
        console.log("fcn called: addDistribution - SERAppManagerController");

        this.serApp.addDistributeSection(this.distributeMode, this.distribute);
        this.clearDistributeObtions();
    }

    /**
     * showDistributeSection
     */
    public showDistributeSection() {
        console.log("fcn called: showDistributeSection - SERAppManagerController");
        this.showDistributeRegion = true;
    }

    /**
     * clearDistributeObtions
     */
    public clearDistributeObtions() {
        console.log("fcn called: clearDistributeObtions - SERAppManagerController");
        this.distributeMode = "";
        this.distribute = {};
        this.showDistributeRegion = false;

    }

    //#endregion

    //#region selection Region

    /**
     * showDistributeSection
     */
    public showSelectionSection() {
        console.log("fcn called: showSelectionSection - SERAppManagerController");

        this.showSelectionRegion = true;
    }

    /**
     * addDistribution
     */
    public addSelection(): void {
        console.log("fcn called: addSelection - SERAppManagerController");

        let selection: ISerSenseSelection = {
            name: this.selection.name,
            type: this.selection.type
        };

        if (typeof(this.selection.objectType)!=="undefined") {
            selection.objectType = this.selection.objectType;
        }

        if (typeof(this.selection.objectType)!=="undefined") {
            selection.values = (this.selection.values as any).split(";");
        }

        this.serApp.addSelectionSection(selection);
        this.clearSelectionObtions();
    }

    /**
     * clearDistributeObtions
     */
    public clearSelectionObtions() {
        console.log("fcn called: clearSelectionObtions - SERAppManagerController");

        this.selection = {};
        this.showSelectionRegion = false;
    }

    //#endregion
}