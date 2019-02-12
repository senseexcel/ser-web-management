import { Observable } from 'rxjs';
import { IDataNode } from '@smc/modules/smc-common';

export namespace RemoteSource {

    export enum SourceType {
        GROUP = 'group',
        LIST  = 'list'
    }

    export interface Source {
        type: SourceType;
        data: string[] | Group[];
    }

    export interface Group {
        name: string;

        items: string[];
    }

    export interface Connector {

        config?: IDataNode;

        close(): void;

        fetch(value: string): Observable<Source>;
    }
}




