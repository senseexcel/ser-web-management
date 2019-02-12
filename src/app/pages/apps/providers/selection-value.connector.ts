import { RemoteSourceConnector } from '@smc/modules/smc-ui/api/remote-source.connector';
import { Observable } from 'rxjs';

export class SelectionValueConnector implements RemoteSourceConnector {

    private selectDimension: string;
    private selectField: string;

    private set dimension(dimension: string) {
        this.selectDimension = dimension;
    }

    private set field(field: string) {
        this.selectField = field;
    }

    public fetch(value: string): Observable<string[]> {
        throw new Error('Method not implemented.');
    }
}
