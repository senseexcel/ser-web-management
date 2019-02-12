import { RemoteSourceConnector } from '../api/remote-source.connector';
import { of } from 'rxjs';

export class EmptyRemoteSourceConnector implements RemoteSourceConnector {

    public fetch(searchString: string) {
        return of([]);
    }
}
