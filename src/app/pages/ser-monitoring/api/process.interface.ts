export const enum ProcessStatus {
    ERROR      = -1,
    IDLE       = 0,
    PROCESSING = 1,
    DELIVER    = 2,
    COMPLETED  = 3
}

export interface IProcess {

    processId: number;

    status: ProcessStatus;

    id: string;

    startTime: string;

    appId: string;

    userId: {
        UserDirectory: string;
        UserId: string;
    };
}
