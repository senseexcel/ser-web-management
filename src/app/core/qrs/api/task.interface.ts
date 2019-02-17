import { ITag } from './tag.interface';
import { IApp } from './app.interface';

export interface ITask {

    id?: string;

    createdDate?: string;

    modifiedDate?: string;

    modifiedByUserName?: string;

    customProperties?: any[];

    published?: boolean;

    publishTime?: string;

    app: IApp;

    isManuallyTriggered?: boolean;

    name: string;

    tags?: ITag[];

    privileges?: [];

    enabled?: boolean;

    taskType?: number;

    nextExecution?: string;

    taskSessionTimeout?: number;

    maxRetries?: number;

    schemaPath?: string;
}
