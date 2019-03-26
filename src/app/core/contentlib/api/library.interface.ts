import { IFile } from './file.interface';

export interface ILibrary {
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
    references: IFile[];
    privileges: any;
    schemaPath: string;
}
