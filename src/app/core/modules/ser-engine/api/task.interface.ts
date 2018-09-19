export interface ITask {

    id?: string;

    createdData?: string;

    modifiedData?: string;

    modifiedByUserName?: string;

    customProperties: [];

    tags: [];

    published?: boolean;

    publishTime?: string;

    app: {
        id: string;

        name: string;

        publishTime?: string;

        published?: boolean;
    };

    isManuallyTriggerd: boolean;

    name: string;

    enabled: boolean;

    nextExecution?: string;

    taskSessionTimeout: number;

    taskType: number;

    maxRetries: number;
}
