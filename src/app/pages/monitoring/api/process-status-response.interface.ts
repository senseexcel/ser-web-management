import { IProcess } from './process.interface';

export enum ResponseStatus {
    ERROR     = -1,
    SUCCESS   = 0
}

export interface IProcessListResponse {
    status: ResponseStatus;

    tasks: IProcess[];
}
