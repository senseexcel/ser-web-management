export interface ITask {

    id: string;

    createdData: string;

    modifiedData: string;

    modifiedByUserName: string;

    app: {
        id: string;

        name: string;

        publishTime: string;

        published: boolean;
    };

    isManuallyTriggerd: boolean;

    name: string;

    taskSessionTimeout: number;

    enabled: boolean;
}
