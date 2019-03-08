import { IProcess } from '../api';

export class ProcessModel implements IProcess {

    requestPending: boolean;
    userId: string;
    appId: string;
    taskId: string;
    startTime: string;
    status: number;
}
