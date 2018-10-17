import { IQrsCustomProperty } from './custom-property.interface';

export interface IQrsApp {

    id: string;

    createdDate: string;

    modifiedDate: string;

    modifiedByUserName: string;

    customProperties: [
        {
            id: string;

            createdDate: string;

            definition: IQrsCustomProperty;

            modifiedDate: string;

            modifiedByUserName: string;

            value: string;

            schemaPath: string;
        }
    ];

    owner: {
        id: string;

        userId: string;

        userDirectory: string;

        name: string;

        privileges: string;

    };

    name: string;

    appId: string;

    sourceAppId: string;

    targetAppId: string;

    publishTime: string;

    published: string;

    tags: string;

    description: string;

    stream: string;

    fileSize: string;

    lastReloadTime: string;

    thumbnail: string;

    savedInProductVersion: string;

    migrationHash: string;

    dynamicColor: string;

    availabilityStatus: string;

    privileges: string;

    schemaPath: string;
}
