import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IQrsFilter as IFilter, IApp, FilterOperator, IQrsFilter, IQrsFilterGroup } from '../api';
import { FilterFactory } from './filter.factory';
import { Injectable } from '@angular/core';
import { IDataNode } from '@smc/modules/smc-common';
import { map, switchMap } from 'rxjs/operators';
import { ITable } from '../api/request/table.interface';

@Injectable()
export class AppRepository {

    public constructor(
        private filterFactory: FilterFactory,
        private http: HttpClient,
    ) {
    }

    /**
     * check app exists
     *
     * @param {string} id
     * @returns {Observable<boolean>}
     * @memberof AppRepository
     */
    public exists(id: string): Observable<boolean> {

        const url = '/qrs/app/count';
        const filter = this.filterFactory.createFilter('id', id, FilterOperator.EQUAL);
        let params: HttpParams = new HttpParams();

        params = params.set('filter', this.filterFactory.createFilterQueryString(filter));
        return this.http.get<{ value: number }>(url, { params })
            .pipe(
                map((response) => response.value !== 0)
            );
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

        if (filter) {
            params = params.set('filter', this.filterFactory.createFilterQueryString(filter));
        }

        const source$ = this.http.get(url, { params });
        return source$ as Observable<IApp[]>;
    }

    public fetchTable(
        definition: ITable,
        start: number = 0,
        limit: number = 0,
        filter: IQrsFilter | IQrsFilterGroup = null
    ): Observable<IApp[]> {
        const url = `/qrs/app/table`;

        let params: HttpParams = new HttpParams();
        params = params.set('skip', String(start));
        params = params.set('take', String(limit));

        if (filter) {
            params = params.set('filter', this.filterFactory.createFilterQueryString(filter));
        }

        const source$ = this.http.post(url, definition, { params });
        return source$ as Observable<IApp[]>;
    }

    /**
     * update app in qrs
     *
     * @param {string} id
     * @param {IDataNode} updateData
     * @returns
     * @memberof AppRepository
     */
    public update(id: string, updateData: IDataNode): Observable<IApp> {

        return this.fetchApp(id).pipe(
            switchMap((app) => {
                updateData.modifiedDate = app.modifiedDate;
                return this.http.put<IApp>(`/qrs/app/${id}`, updateData);
            })
        );
    }

    /**
     * get app by id
     *
     * @param {string} id
     * @returns {Observable<IQrsApp>}
     * @memberof SerAppService
     */
    public fetchApp(id: string): Observable<any> {
        return this.http.get(`/qrs/app/${id}`);
    }

    /**
     * fetch current number of all sense excel apps
     *
     * @returns {Observable<number>}
     * @memberof SerTaskService
     */
    public fetchAppCount(filter?: IFilter): Observable<number> {
        let params: HttpParams = new HttpParams();
        if (filter) {
            params = params.set('filter', this.filterFactory.createFilterQueryString(filter));
        }
        return this.http.get<{value: number}>(`/qrs/app/count`, {params})
            .pipe(map((response) => response.value));
    }
}
