import { Observable } from 'rxjs';
import { IDataNode } from '@smc/modules/smc-common';

export namespace RemoteSource {

    export enum SourceType {
        GROUP = 'group',
        LIST  = 'list'
    }

    export interface Item {
        title: string;
    }

    export interface Source {
        type: SourceType;
        data: Item[] | Group[];
    }

    export interface Group {
        name: string;

        items: Item[];
    }

    export interface Connector<T> {

        config?: T;

        close(): void;

        fetch(value: string): Observable<Source>;
    }
}




