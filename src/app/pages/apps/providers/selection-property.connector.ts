import { RemoteSource } from '@smc/modules/smc-ui/api/remote-source.connector';
import { Observable, of, from, forkJoin } from 'rxjs';
import { importData } from '@smc/modules/smc-common/utils';
import { IDataNode } from '@smc/modules/smc-common';
import { map } from 'rxjs/operators';
import { ISelection } from '../api/selections.interface';

export class SelectionPropertyConnector implements RemoteSource.Connector<IDataNode> {

    private connectedApp: EngineAPI.IApp;

    private dimensionSession: EngineAPI.IGenericObject;
    private fieldSession: EngineAPI.IGenericObject;

    private dimensionsCache: ISelection.Item[] = null;
    private fieldCache: ISelection.Item[] = null;

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
    fetch(needle: string): Observable<RemoteSource.Source> {
        return forkJoin(this.getDimensions(), this.getFields()).pipe(
            map(([dimensions, fields]): RemoteSource.Source => {
                const regExp = new RegExp(needle, 'i');
                const merged = [{
                    name: ISelection.TYPE.DIMENSION,
                    items: dimensions.filter((field) => regExp.test(field.title))
                }, {
                    name: ISelection.TYPE.FIELD,
                    items: fields.filter((field) => regExp.test(field.title))
                }];

                console.dir(merged);

                return {
                    type: RemoteSource.SourceType.GROUP,
                    data: merged
                };
            })
        );
    }

    /**
     * close connector
     *
     * @memberof SelectionPropertyConnector
     */
    close() {
        this.fieldSession.session.close();
        this.dimensionSession.session.close();

        this.fieldCache = null;
        this.dimensionsCache = null;
        this.fieldSession = null;
        this.dimensionSession = null;
        this.connectedApp = null;
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

        this.dimensionSession = await this.connectedApp.createSessionObject(ISelection.DIMENSION_LIST);
        const dimensions = await this.dimensionSession.getLayout() as EngineAPI.IGenericDimensionListLayout;
        const selectionData = dimensions.qDimensionList.qItems.map<ISelection.Item>((item: EngineAPI.IDimensionItemLayout) => {
            return {
                id: item.qInfo.qId,
                title: item.qMeta.title,
                type: ISelection.TYPE.DIMENSION
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

        if (!this.connectedApp) {
            return [];
        }

        if (this.fieldCache) {
            return this.fieldCache;
        }

        this.fieldSession = await this.connectedApp.createSessionObject(ISelection.FIELD_LIST);
        const fields = await this.fieldSession.getLayout() as any;
        const items = (fields.qFieldList as EngineAPI.IFieldList).qItems;

        const fieldItems = items.map<ISelection.Item>((item: EngineAPI.INxFieldDescription) => {
            return {
                title: item.qName,
                type: ISelection.TYPE.FIELD
            };
        });
        this.fieldCache = fieldItems;
        return this.fieldCache;
    }
}
