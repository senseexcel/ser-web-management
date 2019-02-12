import { RemoteSource } from '@smc/modules/smc-ui/api/remote-source.connector';
import { Observable } from 'rxjs';

export class SelectionValueConnector implements RemoteSource.Connector {

    private selectDimension: string;
    private selectField: string;

    private set dimension(dimension: string) {
        this.selectDimension = dimension;
    }

    private set field(field: string) {
        this.selectField = field;
    }

    public close() {
        throw new Error('Method not implemented.');
    }

    public fetch(value: string): Observable<RemoteSource.Source> {
        throw new Error('Method not implemented.');
    }
}
