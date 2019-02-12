import { RemoteSourceConnector } from '@smc/modules/smc-ui/api/remote-source.connector';
import { Observable, of, from, forkJoin } from 'rxjs';
import { importData } from '@smc/modules/smc-common/utils';
import { IDataNode } from '@smc/modules/smc-common';
import { map } from 'rxjs/operators';
import { DIMENSION_LIST } from '../api/session-params';

export class SelectionPropertyConnector implements RemoteSourceConnector {

    private connectedApp: EngineAPI.IApp;

    private dimensionSession: EngineAPI.IGenericObject;
    private fieldSession: EngineAPI.IGenericObject;

    private dimensionsCache = null;
    private fieldCache = null;

    /**
     * set connected app
     *
     * @protected
     * @memberof SelectionPropertyConnector
     */
    protected set app(app: EngineAPI.IApp) {
        this.connectedApp = app;
    }

    @importData
    public set config(data: IDataNode) { }

    /**
     * fetch dimensions and fields and merge the value
     * together to one big list
     *
     * @returns {Observable<any[]>}
     * @memberof SelectionPropertyConnector
     */
    fetch(needle: string): Observable<any[]> {
        return forkJoin(this.getDimensions(), this.getFields()).pipe(
            map(([dimensions, fields]) => {
                const regExp = new RegExp(needle, 'i');
                const merged = [...dimensions, ...fields];

                return merged.filter((field) => regExp.test(field.title));
            })
        );
    }

    /**
     * get dimensions from hypercube
     *
     * @private
     * @param {string} needle
     * @returns {Promise<any>}
     * @memberof SelectionPropertyConnector
     */
    private async getDimensions(): Promise<any> {

        // no app no data
        if (!this.connectedApp) {
            return [];
        }

        // if we allready have cached values return them
        if (this.dimensionsCache) {
            return this.dimensionsCache;
        }

        this.dimensionSession = await this.connectedApp.createSessionObject(DIMENSION_LIST);
        const dimensions = await this.dimensionSession.getLayout() as EngineAPI.IGenericDimensionListLayout;
        const selectionData = dimensions.qDimensionList.qItems.map<Object>((item: EngineAPI.IDimensionItemLayout) => {
            return {
                id: item.qInfo.qId,
                title: item.qMeta.title,
                type: 'dimension'
            };
        });
        this.dimensionsCache = selectionData;
        return this.dimensionsCache;
    }

    /**
     * get fields from hypercube
     *
     * @private
     * @returns
     * @memberof SelectionPropertyConnector
     */
    private async getFields() {

        if (!this.app) {
            return [];
        }

        /** @todo implement */
        return [1, 2, 3, 4, 5];
    }
}
