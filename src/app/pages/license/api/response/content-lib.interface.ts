export interface IContentLibResponse {
        id: string;
        createdDate: string;
        modifiedDate: string;
        modifiedByUserName: string;
        customProperties: any[];
        owner: {
            id: string;
            userId: string;
            userDirectory: string;
            name: string;
            privileges: any;
        };
        name: string;
        type: string;
        tags: string[];
        whiteList: {
            id: string;
            libraryType: number;
            privileges: any;
        };
        references: IContentLibFileReference[];
        privileges: any;
        schemaPath: string;
}

export interface IContentLibFileReference {
    id: string;
    dataLocation: string;
    logicalPath: string;
    externalPath: string;
    serveOptions: number;
    privileges: any;
}
