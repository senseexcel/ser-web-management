import { RemoteSource } from '@smc/modules/smc-ui/api/item-list.interface';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISelection } from '../api/selections.interface';

export class SelectionValueConnector implements RemoteSource.Connector<ISelection.ValueConnectorConfig> {

    private connectedApp: EngineAPI.IApp;
    private patches: EngineAPI.INxPatch[];
    private selectFrom: string;
    private selectType: ISelection.TYPE;
    private valueSession: EngineAPI.IGenericList;
    private isDisabled: any;

    public set config(config: ISelection.ValueConnectorConfig) {

        if (config.app) {
            this.connectedApp = config.app;
        }

        if (config.selectFrom) {
            this.patches = this.createPatches(config.selectFrom);

            this.selectFrom = config.selectFrom.value;
            this.selectType = config.selectFrom.type;
        }
    }

    public close() {
        this.valueSession.session.close();
        this.valueSession = null;
        this.connectedApp = null;
        this.selectFrom = null;
        this.selectType = null;
        this.patches = [];
    }

    /**
     *
     *
     * @param {string} needle
     * @returns {Observable<RemoteSource.Source>}
     * @memberof SelectionValueConnector
     */
    public fetch(needle: string): Observable<RemoteSource.Source> {

        if (!this.connectedApp || this.isDisabled || !this.selectFrom) {
            return of({
                type: RemoteSource.SourceType.LIST,
                data: []
            });
        }

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

    /**
     *
     *
     * @param {boolean} state
     * @memberof SelectionValueConnector
     */
    public disable(state: boolean): void {
        this.isDisabled = state;
    }

    /**
     * create new session to app or return existing one
     *
     * @protected
     * @returns {Promise<EngineAPI.IGenericList>}
     * @memberof SelectionValueConnector
     */
    protected async establishSession(): Promise<EngineAPI.IGenericList> {

        let isDirty = false;

        if (!this.valueSession) {
            this.valueSession = await this.connectedApp.createSessionObject(ISelection.VALUE_LIST);
            isDirty = true;
        }

        if (this.patches.length) {
            await this.valueSession.applyPatches(this.patches);
            isDirty = true;
            this.patches = [];
        }

        if (isDirty) {
            await this.valueSession.getLayout();
        }

        return this.valueSession;
    }

    /**
     * fetch values from session with given search string
     *
     * @protected
     * @param {string} searchFor
     * @returns {Promise<EngineAPI.INxDataPage[]>}
     * @memberof SelectionValueConnector
     */
    protected async fetchValues(searchFor: string): Promise<EngineAPI.INxDataPage[]> {
        const session = await this.establishSession();

        await session.searchListObjectFor('/qListObjectDef', searchFor);
        await session.getLayout();

        return await session.getListObjectData('/qListObjectDef', [{
            qTop: 0,
            qLeft: 0,
            qHeight: 20,
            qWidth: 1
        }]);
    }


    /**
     * create patches
     *
     * @private
     * @param {*} selectionConfig
     * @returns {EngineAPI.INxPatch[]}
     * @memberof SelectionValueConnector
     */
    private createPatches(config: ISelection.SelectionConfig): EngineAPI.INxPatch[] {
        const patches: EngineAPI.INxPatch[] = [];
        const dimensionPatch: EngineAPI.INxPatch = {
            qOp: 'Replace',
            qPath: 'qListObjectDef/qLibraryId',
            qValue: config.type === ISelection.TYPE.DIMENSION ? `"${config.value}"` : '\"\"'
        };

        const fieldPatch: EngineAPI.INxPatch = {
            qOp: 'Replace',
            qPath: 'qListObjectDef/qDef/qFieldDefs',
            qValue: config.type === ISelection.TYPE.FIELD ? JSON.stringify([config.value]) : JSON.stringify([])
        };

        if (config.type !== this.selectType) {
            patches.push(dimensionPatch, fieldPatch);
        } else if (config.type === ISelection.TYPE.DIMENSION) {
            patches.push(dimensionPatch);
        } else {
            patches.push(fieldPatch);
        }
        return patches;
    }
}
