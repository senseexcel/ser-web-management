export const enum ProcessStatus {
    ERROR      = -1,
    IDLE       = 0,
    PROCESSING = 1,
    DELIVER    = 2,
    COMPLETED  = 3
}

export interface IProcess {

    asposseVersion: string;

    count: number;

    engineVersion: string;

    reports: any[];

    startTime: string;

    runTime: string;

    status: 'ABORT' | 'ERROR' | 'SUCCESS' | 'RETRYERROR';

    taskId: string;
}
