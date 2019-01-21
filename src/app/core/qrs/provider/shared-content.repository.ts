import { Injectable } from '@angular/core';
import { FilterFactory } from './filter.factory';
import { HttpClient } from '@angular/common/http';
import { ITableData } from '../api/table.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class SharedContentRepository {

    constructor(
        private http: HttpClient,
        private filterFactory: FilterFactory
    ) {}

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
            'columns' : [
                {'name': 'name', 'columnType': 'Property', 'definition': 'name'},
                {'name': 'type', 'columnType': 'Property', 'definition': 'type'},
                {'name': 'description', 'columnType': 'Property', 'definition': 'description'},
                {'name': 'owner', 'columnType': 'Property', 'definition': 'owner'},
                {'name': 'createdDate', 'columnType': 'Property', 'definition': 'createdDate'},
                {'name': 'modifiedDate', 'columnType': 'Property', 'definition': 'modifiedDate'},
                {'name': 'tags', 'columnType': 'Property', 'definition': 'tags'},
                {'name': 'metaData', 'columnType': 'Property', 'definition': 'metaData'}
            ]
        };

        return this.http.post(url, tableDefinition, {
            params: {
                skip: String(start),
                take: String(limit)
            }
        }) as Observable<ITableData>;
    }
}
