import { ISerReport,
         ISerConnection }               from "../node_modules/ser.api/index";

//#region enums

enum ESerFileMode {
    DeleteAllFirst,
    Override,
    CreateOnly
}

export enum ESERDistribute {
    hub,
    file,
    mail
}

//#endregion

//#region interfaces

export interface IDisplayApp {
    name: string;
    id: string;
}

export interface IConfig {
    logLvl: string;
}

export interface ISERDistribute {
    hub?: ISERHub;
    file?: ISERFile;
    mail?: any;
}

interface ISERHub {
    owner: string;
    mode: string;
    connections: string;
}

export interface ISERFile {
    target: string;
    mode: ESerFileMode;
    connections: ISerConnection | string;
}

export interface ISERReportExtend extends ISerReport {
    distribute?: ISERDistribute;
}

//#endregion