export const enum ProcessStatus {
    ERROR      = -1,
    IDLE       = 0,
    PROCESSING = 1,
    DELIVER    = 2,
    COMPLETED  = 3
}

export interface IProcess {

    userId: string;

    appId: string;

    taskId: string;

    startTime: string;

    status: number;
}
