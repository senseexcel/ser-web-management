export enum CustomPropertyObjectType {
    App        = 'App',
    ReloadTask = 'ReloadTask'
}

export interface ICustomProperty {

    id?: string;

    createdDate?: string;

    modifiedDate?: string;

    modifiedByUserName?: string;

    name: string;

    valueType: string;

    choiceValues: string[];

    objectTypes: string[];

    description: string;

    privileges?: any;

    schemaPath?: string;
}
