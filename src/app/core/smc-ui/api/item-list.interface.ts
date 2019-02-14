import { Observable } from 'rxjs';

export namespace ItemList {

    export interface Item {
        title: string;
    }

    export interface Group {
        name: string;
        items: Item[];
    }

    export enum MODE {
        MULTI = 'multi',
        SINGLE = 'single'
    }

    export interface ChangedEvent {
        added: Item[];
        removed: Item[];
    }
}

export namespace RemoteSource {

    export enum SourceType {
        GROUP = 'group',
        LIST  = 'list'
    }

    export interface Source {
        type: SourceType;
        data: ItemList.Item[] | ItemList.Group[];
    }

    export interface Connector<T> {
        config?: T;
        disable(state: boolean): void;
        close(): void;
        fetch(value: string): Observable<Source>;
    }
}




