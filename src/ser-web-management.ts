import * as angular                     from "angular";
import { Connection }                   from "./lib/connection";
import { SERAppManagerController }      from "./lib/SERAppManagerController";
import { IConfig }                      from "./lib/utils";
import { ISerConfig,
         ISerTask,
         ISerReport,
         ISerConnection,
         ISerTemplate,
         ISerGeneral }                  from "./node_modules/ser.api/index";


const config: IConfig = require("./config.json");

// todo rename ???
class SERManagerController {

    //#region Variables

    private connection: Connection;
    private createAppManagerController: SERAppManagerController;
    private session: enigmaJS.ISession;
    private timeout: ng.ITimeoutService;
    private scope: ng.IScope;

    //#endregion

    static $inject = ["$timeout", "$scope"];

    constructor(timeout: ng.ITimeoutService, scope: ng.IScope) {
        console.log("Constructor called: SERManager");

        this.timeout = timeout;
        this.scope = scope;
        this.connection = new Connection();
        this.connection.createSession()
        .then((session) => {
            this.session = session;
        })
        .catch((error) => {
            console.error("ERROR in Constructor of SERManager", error);
        });
    }

    /**
     * createNewTaskApp
     */
    public createNewTaskApp(): Promise<void> {
        console.log("fcn called: createNewTaskApp - SERManager");

        return new Promise((resolve, reject) => {
            this.session.open()
            .then((global: EngineAPI.IGlobal) => {
                this.createAppManagerController = new SERAppManagerController(global, this.timeout, this.scope);
                resolve();
            })
            .catch((error) => {
                Promise.reject(error);
            });
        });
    }

    /**
     * fetchAllAppsWithSer
     */
    public fetchAllAppsWithSer() : Promise<any> {
        return new Promise((resolve, reject) => {
            // this.qlikGlobal.getDocList()
            // .then((appList) => {

            //     let arrDocIps: Promise<string>[] = [];

            //     for (let i = 0; i < appList.length; i++) {
            //         const app = appList[i];
            //         console.log("APP: ", app.qDocId);

            //         arrDocIps.push(this.getAppIdWithSerCall(app.qDocId));
            //     }

            // a     Promise.all(arrDocIps)
            //     .then((res) => {
            //         console.log("Result", res);
            //     })
            //     .catch((error) => {
            // b         Promise.reject(error);
            //     });

            // })
            // .catch((error) => {
            //     console.log(error);
            //     this.logger.error("Error in getAllApps", error);
            // });
        });
    }

    private getAppIdWithSerCall(appId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // let specConfic = this.configEnigma;
            // specConfic.url = `${specConfic.url}/identity/${appId}`;
            // let session = enigma.create(specConfic);
            // session.open()
            // .then((test: EngineAPI.IGlobal) => {
            //     return test.openDoc(appId, "", "", "", true);
            // })
            // .then((openDoc) => {
            //     return openDoc.getScript();
            // })
            // .then((script) => {
            //     console.log("Serch script: ", script.indexOf("SER.START"));
            //     resolve(appId);
            // })
            // .catch((error) => {
            //     console.log("error", error);
            //     reject(error);
            // });
        });
    }
}

var app = angular.module("app", []);
app.controller("RootCtrl", SERManagerController);
