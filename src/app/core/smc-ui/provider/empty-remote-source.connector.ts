import { RemoteSource } from '../api/remote-source.connector';
import { of, Observable } from 'rxjs';

export class EmptyRemoteSourceConnector implements RemoteSource.Connector {

    public close() {
    }

    public fetch(): Observable<RemoteSource.Source> {
        return of({
            type: RemoteSource.SourceType.LIST,
            data: []
        });
    }
}
