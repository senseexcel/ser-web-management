//#region imports

import * as hjson                       from "hjson";
import { SERReport }                    from "./serReport";
import { ISerTemplate,
         ISerConnection }               from "../node_modules/ser.api/index";

//#endregion

export class SERApp {

    private global: EngineAPI.IGlobal;
    private defaultScriptPart: string;




    public app: EngineAPI.IApp;

    constructor(global: EngineAPI.IGlobal) {
        console.log("Constructor called: SERApp");

        this.global = global;
        this.defaultScriptPart = `
            Let resultWithTaskId = SER.START(task);
            TRACE TaskId: $(resultWithTaskId);

            Let version = SER.STATUS('');
            TRACE Version: $(version);
            TRACE Result: $(resultWithTaskId);

            Set Status = 0;
            Do while Status < 3 and Status > -1
            Let result = SER.STATUS(resultWithTaskId);
            Let Status = num#(TextBetween(result,'status":','}'))+0;
            TRACE Status: $(Status);
            Sleep 1000;
            Loop

            TRACE $(result);
        `;
    }

    private createApplication(appName: string): Promise<EngineAPI.IApp> {
        console.log("fcn called: createApplication - SERApp");

        return new Promise((resolve, reject) => {
            this.global.createApp(appName, "main")
            .then((app) => {
                console.log("APP", app);
                return this.global.openDoc(app.qAppId);
            })
            .then((app: EngineAPI.IApp) => {
                resolve(app);
            })
            .catch((error) => {
                console.error("ERROR in createApplication", error);
                reject(error);
            });
        });
    }

    /**
     * initApp
     */
    public initApp(app?: EngineAPI.IApp):Promise<void> {
        console.log("fcn called: initApp - SERApp");

        return new Promise((resolve, reject) => {
            if (typeof(app)!=="undefined") {
                this.app = app;
                resolve();
            } else {
                this.createApplication("InitialAppWillBeRenamed")
                .then((app) => {
                    this.app = app;
                    resolve();
                })
                .catch((error) => {
                    console.log("ERROR in constructor of SERApp", error);
                    reject(error);
                });
            }
        });
    }

    public createSerScript(appName: string, input: string, obj?: any): Promise<void> {
        console.log("fcn called: createSerScript - SERApp");

        return new Promise((resolve, reject) => {
            let serRepor: SERReport = new SERReport(appName, input);
            serRepor.createReportConfig()
            .then((serReportProperties) => {

                let hstring = hjson.stringify(serReportProperties);

                let script: string = `
                    SET task = ´${hstring.substring(1, hstring.length-2)}´;
                    ${this.defaultScriptPart}
                `;

                console.log("script", script);

                return this.app.setScript(script);
            })
            .then(() => {
                return this.app.doSave();
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * getContentLibraries
     */
    public getContentLibraries(): Promise<EngineAPI.IContentLibraryList> {
        console.log("fcn called: getContentLibraries - SERApp");

        return new Promise((resolve, reject) => {
            this.app.getContentLibraries()
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
    public loadContentForLib(libName: string): Promise<EngineAPI.IStaticContentList> {
        console.log("fcn called: loadContentForLib - SERApp");

        return new Promise((resolve, reject) => {
            this.app.getLibraryContent(libName)
            .then((content) => {
                resolve(content);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * setAppName
     */
    public setAppName(appName: string): Promise<void> {
        console.log("fcn called: setAppName - SERApp");

        return new Promise((resolve, reject) => {
            this.app.getAppProperties()
            .then((properties) => {
                properties.qTitle = appName;
                return this.app.setAppProperties(properties);
            })
            .then(() => {
                this.app.doSave();
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    public doReload() {
        //
    }

    public loadScript() {
        //
    }
}