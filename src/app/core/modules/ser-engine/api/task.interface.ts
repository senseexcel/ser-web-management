export interface ITask {

    id?: string;

    createdData?: string;

    modifiedData?: string;

    modifiedByUserName?: string;

    customProperties?: [];

    published?: boolean;

    publishTime?: string;

    app: {
        id: string;

        name: string;

        publishTime?: string;

        published?: boolean;
    };

    isManuallyTriggered?: boolean;

    name?: string;

    tags: [];

    enabled?: boolean;

    taskType: number;

    nextExecution?: string;

    taskSessionTimeout?: number;

    maxRetries?: number;
}
