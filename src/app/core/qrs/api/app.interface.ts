import { ICustomProperty } from './custom-property.interface';
import { ITag } from './tag.interface';

export interface IApp {

    id: string;

    createdDate: string;

    modifiedDate: string;

    modifiedByUserName: string;

    customProperties: [
        {
            id: string;

            createdDate: string;

            definition: ICustomProperty;

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

    tags?: ITag[];

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
