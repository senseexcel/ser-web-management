//#region imports
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
import { SERFetchAppsManagerController } from "./lib/SERFetchAppsManagerController";
//#endregion

//#region global variables
const config: IConfig = require("./config.json");
//#endregion

class SERManagerController {

    //#region Variables
    private connection: Connection;
    private createAppManagerController: SERAppManagerController;
    private appsManagerController: SERFetchAppsManagerController;
    private timeout: ng.ITimeoutService;
    private scope: ng.IScope;
    //#endregion

    static $inject = ["$timeout", "$scope"];

    constructor(timeout: ng.ITimeoutService, scope: ng.IScope) {
        console.log("Constructor called: SERManagerController");

        this.timeout = timeout;
        this.scope = scope;
    }

    /**
     * createNewTaskApp
     */
    createNewTaskApp(): void {
        console.log("fcn called: createNewTaskApp - SERManager");

        try {
            this.createAppManagerController = new SERAppManagerController(this.timeout, this.scope);
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
