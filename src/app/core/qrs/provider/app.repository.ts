import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IQrsFilter as IFilter, IApp } from '../api';
import { FilterFactory } from './filter.factory';
import { Injectable } from '@angular/core';

@Injectable()
export class AppRepository {

    public constructor(
        private filterFactory: FilterFactory,
        private http: HttpClient
    ) {
    }

    /**
     * filters all given apps for sense excel reporting apps
     *
     * @private
     * @param {IQlikApp[]} apps
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    private fetchAppsByScript(apps): Observable<any> {
        return of([]);
    }

    /**
     * fetch all apps
     *
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    public fetchApps(filter: IFilter = null): Observable<IApp[]> {

        const url = `/qrs/app/full/`;
        let params: HttpParams = new HttpParams();

        if (filter ) {
            params = params.set('filter', this.filterFactory.createFilterQueryString(filter));
        }

        const source$ = this.http.get(url, {params});
        return source$ as Observable<IApp[]>;
    }

    /**
     * get app by id
     *
     * @param {string} id
     * @returns {Observable<IQrsApp>}
     * @memberof SerAppService
     */
    public fetchApp(id: string): Observable<any> {
        return of([]);
    }

    /**
     * fetch current number of all sense excel apps
     *
     * @returns {Observable<number>}
     * @memberof SerTaskService
     */
    public fetchAppCount(qrsFilter?: IFilter): Observable<number> {
        return of(1);
    }

    /**
     *  fetch all sense excel reporting apps
     *
     * @private
     * @param {IQlikApp[]} apps
     * @returns {Observable<IQlikApp[]>}
     * @memberof SerAppService
     */
    public fetchSerApps(useTag = true, excludeTag: boolean = false): Observable<any> {
        return of([]);
    }

    public addTagToApp(app: any) {
    }

    /**
     * create new app
     *
     * @param {string} appName
     * @returns {Observable<any>}
     * @memberof SerAppService
     */
    public createApp(appName: string): Promise<any> {
        return Promise.resolve();
    }
}
