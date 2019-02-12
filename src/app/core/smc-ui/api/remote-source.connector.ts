import { Observable } from 'rxjs';
import { IDataNode } from '@smc/modules/smc-common';

export interface RemoteSourceConnector {

    config?: IDataNode;

    fetch(value: string): Observable<string[]>;
}
