import { Injectable } from '@angular/core';
import { FilterFactory } from './filter.factory';
import { HttpClient } from '@angular/common/http';
import { ITableData } from '../api/table.interface';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class SharedContentRepository {

    constructor(
        private http: HttpClient,
        private filterFactory: FilterFactory
    ) { }

    public count(): Observable<number> {
        const url = '/qrs/sharedcontent/count';
        return this.http.get(url).pipe(
            map((response: any) => response.value || 0)
        );
    }

    /**
     * fetch table data for
     *
     * @param {number} [start=0]
     * @param {number} [limit=100]
     * @returns
     * @memberof SharedContentRepository
     */
    public fetchTable(start: number = 0, limit: number = 100): Observable<ITableData> {

        const url = '/qrs/sharedcontent/table';
        const tableDefinition = {
            'entity': 'SharedContent',
            'columns': [
                { 'name': 'Id', 'columnType': 'Property', 'definition': 'id' },
                { 'name': 'Name', 'columnType': 'Property', 'definition': 'name' },
                { 'name': 'Type', 'columnType': 'Property', 'definition': 'type' },
                { 'name': 'Description', 'columnType': 'Property', 'definition': 'description' },
                { 'name': 'Owner', 'columnType': 'Property', 'definition': 'owner' },
                { 'name': 'CreatedDate', 'columnType': 'Property', 'definition': 'createdDate' },
                { 'name': 'ModifiedDate', 'columnType': 'Property', 'definition': 'modifiedDate' },
                { 'name': 'Tags', 'columnType': 'Property', 'definition': 'tags' },
                { 'name': 'MetaData', 'columnType': 'Property', 'definition': 'metaData' }
            ]
        };

        return this.http.post(url, tableDefinition, {
            params: {
                skip: String(start),
                take: String(limit)
            }
        }) as Observable<ITableData>;
    }

    /**
     * delete shared content data by ids
     *
     * @param {number[]} ids
     * @memberof SharedContentRepository
     */
    public delete(sharedContentIds: number[]): Observable<boolean> {

        const url = '/qrs/sharedcontent';
        return of(sharedContentIds).pipe(
            mergeMap((ids: number[]) => {
                /**
                 * convert given ids into http delete request to remove
                 * given shared content. If some Error occours content could
                 * not deleted and return -1 otherwise return 1
                 */
                const deleteRequests = ids.map(
                    id => this.http.delete<number>(`${url}/${id}`).pipe(
                        map(() => 1),
                        catchError(() => of(-1))
                    )
                );

                /**
                 * join all requests
                 */
                return forkJoin(...deleteRequests).pipe(
                    map((response: number[]) => !response.some((status) => status === -1))
                );
            })
        );
    }
}
