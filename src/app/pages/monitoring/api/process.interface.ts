export const enum ProcessStatus {
    ERROR      = -1,
    READY      = 0,
    PROCESSING = 1,
    DELIVER    = 2,
    COMPLETED  = 3,
    ABORTING   = 4
}

export interface IProcess {

    userId: string;

    appId: string;

    taskId: string;

    startTime: string;

    status: number;

    requestPending: boolean;
}
