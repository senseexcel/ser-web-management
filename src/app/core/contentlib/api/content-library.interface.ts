import { IFile } from './file.interface';
import { Observable, Subject } from 'rxjs';
import { ILibrary } from './library.interface';

export interface IContentLibrary {

    deleted$: Subject<boolean>;

    fileUploaded$: Subject<string>;

    fileRemoved$: Subject<any>;

    update(data: ILibrary): void;

    fetchFile(fileName: string): IFile;

    /**
     * checks file allready exists
     */
    fileExists(name: string): Observable<boolean>;

    /**
     *
     */
    createFile(name: string, content?: string): Observable<string>;

    /**
     * read contents of a file
     */
    readFile(file: IFile): Observable<string>;

    updateFile(name: string, content: string): Observable<string>;
}
