import { RemoteSource } from '@smc/modules/smc-ui/api/remote-source.connector';
import { Observable, from } from 'rxjs';
import { IDataNode } from '@smc/modules/smc-common';
import { map } from 'rxjs/operators';
import { ISelection } from '../api/selections.interface';

export class SelectionValueConnector implements RemoteSource.Connector {

    private session: EngineAPI.IGenericList;
    private selectDimension: string;
    private selectField: string;
    private connectedApp: EngineAPI.IApp;

    private set dimension(dimension: string) {
        this.selectDimension = dimension;
    }

    private set field(field: string) {
        this.selectField = field;
    }

    public set config(config: IDataNode) {
        this.connectedApp = config.app;
    }

    public close() {
        throw new Error('Method not implemented.');
    }

    public fetch(needle: string): Observable<RemoteSource.Source> {

        return from(this.fetchValues(needle)).pipe(
            map((dataPages) => {

                const result: EngineAPI.INxCell[][] = dataPages[0].qMatrix;
                const values = result.reduce<ISelection.Item[]>((current, cell) => {
                    if (!cell[0].qText || cell[0].qText === '-') {
                        return current;
                    }
                    current.push({
                        title: cell[0].qText,
                        type: ISelection.TYPE.VALUE
                    });
                    return current;
                }, []);

                return {
                    type: RemoteSource.SourceType.LIST,
                    data: values
                };
            })
        );
    }

    protected async etablishSession(): Promise<EngineAPI.IGenericList> {
        if (!this.session) {
            this.session = await this.connectedApp.createSessionObject(ISelection.VALUE_LIST);
            await this.session.getLayout();
        }
        return this.session;
    }

    protected async fetchValues(searchFor: string): Promise<EngineAPI.INxDataPage[]> {
        const session = await this.etablishSession();

        /*
        session.applyPatches([{
            qOp: 'Replace',
            qPath: '/qListObjectDef/qLibraryId',
            qValue: ''
        }, {
            qOp: 'Replace',
            qPath: '/qListObjectDef/qDef/qFieldDefs',
            qValue: `['a', 'b']`
        }]);

        getLayout();
        */

        return await session.getListObjectData('/qListObjectDef', [{
            qTop: 0,
            qLeft: 0,
            qHeight: 20,
            qWidth: 1
        }]);

    }
}
