
import { RemoteSource, ItemList } from '@smc/modules/item-list/api/item-list.interface';
import { Observable, forkJoin, from, of } from 'rxjs';
import { IDataNode } from '@smc/modules/smc-common';
import { map } from 'rxjs/operators';
import { ISelection } from '../api/selections.interface';

export class SelectionBookmarkConnector implements RemoteSource.Connector<IDataNode> {

    private connectedApp: EngineAPI.IApp;
    private bookmarkCache: ISelection.Item[] = null;
    private isDisabled: boolean;

    /**
     * set connected app
     *
     * @protected
     * @memberof SelectionPropertyConnector
     */
    protected set app(app: EngineAPI.IApp) {
        if (app && app !== this.connectedApp) {
            this.bookmarkCache = null;
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
        return from(this.getBookmarks()).pipe(
            map((bookmarks): RemoteSource.Source => {
                const regExp = new RegExp(needle, 'i');
                return {
                    data: bookmarks.filter((bookmark) => regExp.test(bookmark.title)),
                    type: RemoteSource.SourceType.LIST
                };
            })
        );
    }

    /**
     * close connector
     *
     * @memberof SelectionPropertyConnector
     */
    async close() {
        this.bookmarkCache   = null;
        this.connectedApp = null;
        this.isDisabled   = false;
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
    public async findBookmarkByName(name: string): Promise<ISelection.Item | null> {

        if (!name || name === '') {
            return null;
        }

        const dimensions = await this.getBookmarks();
        const pattern = new RegExp(`^${name}$`);
        const dimension = dimensions.find((item: ISelection.Item) => {
            return pattern.test(item.title);
        });
        return dimension || null;
    }

    /**
     * get dimensions from hypercube
     *
     * @private
     * @param {string} needle
     * @returns {Promise<any>}
     * @memberof SelectionPropertyConnector
     */
    private async getBookmarks(): Promise<ISelection.Item[]> {

        // no app no data
        if (!this.connectedApp || this.isDisabled) {
            return [];
        }

        // if we allready have cached values return them
        if (this.bookmarkCache) {
            return this.bookmarkCache;
        }

        /** casting to any since typings are wrong */
        const bookmarks: ISelection.BookmarkEntry[] = await this.connectedApp.getBookmarks(ISelection.BOOKMARK_LIST) as any;
        this.bookmarkCache = bookmarks.map<ISelection.Item>((bookmark) => {
            return {
                id: bookmark.qInfo.qId,
                title: bookmark.qMeta.title,
                type: ISelection.TYPE.BOOKMARK
            };
        });

        // this.bookmarkCache = bookmarks;
        return this.bookmarkCache;
    }
}
