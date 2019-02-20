import { RemoteSource } from '@smc/modules/item-list/api/item-list.interface';
import { Observable, forkJoin } from 'rxjs';
import { IDataNode } from '@smc/modules/smc-common';
import { map } from 'rxjs/operators';
import { ISelection } from '../api/selections.interface';

export class SelectionPropertyConnector implements RemoteSource.Connector<IDataNode> {

    private connectedApp: EngineAPI.IApp;

    private dimensionSession: EngineAPI.IDimensionListObject;
    private fieldSession: EngineAPI.IGenericObject;

    private dimensionsCache: ISelection.Item[] = null;
    private fieldCache: ISelection.Item[] = null;
    private isDisabled: boolean;

    /**
     * set connected app
     *
     * @protected
     * @memberof SelectionPropertyConnector
     */
    protected set app(app: EngineAPI.IApp) {
        if (app && app !== this.connectedApp) {
            this.dimensionsCache = null;
            this.fieldCache = null;
        }
        this.connectedApp = app;
    }

    public set config(data: IDataNode) {
        this.app = data.app;
    }

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

        if (this.fieldSession && this.dimensionSession) {
            this.fieldSession.session.close();
            this.dimensionSession.session.close();
        }

        this.fieldCache = null;
        this.dimensionsCache = null;
        this.fieldSession = null;
        this.dimensionSession = null;
        this.connectedApp = null;
        this.isDisabled = false;
    }

    disable(state: boolean) {
        this.isDisabled = state;
    }

    /**
     * find dimension by name
     *
     * @param {string} name
     * @returns {(Observable<ISelection.Item | null>)}
     * @memberof SelectionPropertyConnector
     */
    public async findDimensionByName(name: string): Promise<ISelection.Item | null> {

        if (!name || name === '') {
            return null;
        }

        const dimensions = await this.getDimensions();
        const pattern = new RegExp(`^${name}$`);
        const dimension = dimensions.find((item: ISelection.Item) => {
            return pattern.test(item.title);
        });
        return dimension || null;
    }

    /**
     * find field by name
     *
     * @param {string} name
     * @returns {(Promise<ISelection.Item | null>)}
     * @memberof SelectionPropertyConnector
     */
    public async findFieldByName(name: string): Promise<ISelection.Item | null> {

        if (!name || name === '') {
            return null;
        }

        const fields = await this.getFields();
        const pattern = new RegExp(`^${name}$`);
        const field = fields.find((item: ISelection.Item) => {
            return pattern.test(item.title);
        });
        return field || null;
    }

    /**
     * get dimensions from hypercube
     *
     * @private
     * @param {string} needle
     * @returns {Promise<any>}
     * @memberof SelectionPropertyConnector
     */
    private async getDimensions(): Promise<ISelection.Item[]> {

        // no app no data
        if (!this.connectedApp || this.isDisabled) {
            return [];
        }

        // if we allready have cached values return them
        if (this.dimensionsCache) {
            return this.dimensionsCache;
        }

        this.dimensionSession = await this.connectedApp.createSessionObject(ISelection.DIMENSION_LIST);
        const dimensionList = await this.dimensionSession.getLayout();
        const selectionData = dimensionList.qDimensionList.qItems.map<ISelection.Item>((item) => {
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
