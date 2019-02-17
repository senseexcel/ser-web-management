import { RemoteSource } from '../api/item-list.interface';
import { of, Observable } from 'rxjs';
import { IDataNode } from '@smc/modules/smc-common';

export class EmptyRemoteSourceConnector implements RemoteSource.Connector<IDataNode> {

    disable(state: boolean): void {
    }

    public close() {
    }

    public fetch(): Observable<RemoteSource.Source> {
        return of({
            type: RemoteSource.SourceType.LIST,
            data: []
        });
    }
}
