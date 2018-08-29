//#region imports
import * as angular                         from "angular";
import { Connection }                       from "./lib/connection";
import { SERAppManagerController }          from "./lib/SERAppManagerController";
import { IConfig }                          from "./lib/utils";
import { SERFetchAppsManagerController }    from "./lib/SERFetchAppsManagerController";
import { ISerConfig,
         ISerTask,
         ISerReport,
         ISerConnection,
         ISerTemplate,
         ISerGeneral }                      from "./node_modules/ser.api/index";
//#endregion

//#region global variables
const config: IConfig = require("./config.json");
//#endregion

class SERManagerController {

    //#region Variables
    private createAppManagerController: SERAppManagerController;
    private appsManagerController: SERFetchAppsManagerController;
    private timeout: ng.ITimeoutService;

    title = "SER Manager";
    //#endregion

    static $inject = ["$timeout"];

    constructor(timeout: ng.ITimeoutService) {
        console.log("Constructor called: SERManagerController");
        this.timeout = timeout;
    }

    /**
     * createNewTaskApp
     */
    createNewTaskApp(): void {
        console.log("fcn called: createNewTaskApp - SERManager");

        try {
            this.createAppManagerController = new SERAppManagerController(this.timeout);
        } catch (error) {
            console.error("ERROR in createNewTaskApp - SERManager", error);
        }
    }

    /**
     * createAppList
     */
    createAppList(): void {
        console.log("fcn called: createAppList - SERManager");

        try {
            this.appsManagerController = new SERFetchAppsManagerController(this.timeout);
        } catch (error) {
            console.error("ERROR in createAppList - SERManager", error);
        }
    }

}

var app = angular.module("app", []);
app.controller("RootCtrl", SERManagerController);
