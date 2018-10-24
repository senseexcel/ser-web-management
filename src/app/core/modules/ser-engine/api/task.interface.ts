import { ITag } from '@core/api/tag.interface';

export interface ITask {

    id?: string;

    createdDate?: string;

    modifiedDate?: string;

    modifiedByUserName?: string;

    customProperties?: any[];

    published?: boolean;

    publishTime?: string;

    app: {
        id: string;

        name: string;

        publishTime?: string;

        published?: boolean;

        availabilityStatus?: number;
    };

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
