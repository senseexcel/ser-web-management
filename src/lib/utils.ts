import { ISerReport,
         ISerConnection }               from "../node_modules/ser.api/index";

//#region enums

enum ESerFileMode {
    DeleteAllFirst,
    Override,
    CreateOnly
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