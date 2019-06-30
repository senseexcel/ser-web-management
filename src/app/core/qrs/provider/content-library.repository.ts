import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ITableData } from '../api/table.interface';
import { FilterFactory } from './filter.factory';

export interface IContentLibrary {
    id: string;
    name: string;
}

export interface IStaticContent {
    id: string;
    dataLocation: string;
    externalPath: string;
    logicalPath: string;
}

interface ISelection {
    id: string;
    createdDate: string;
    modifiedDate: string;
    modifiedByUserName: string;
    items: [{
        id: string;
        createdDate: string;
        modifiedDate: string;
        modifiedByUserName: string;
        type: string;
        objectID: string;
        objectName: string;
        schemaPath: string;
    }];
    privileges: any;
    schemaPath: string;
}

@Injectable()
export class ContentLibraryService {

    constructor(
        private http: HttpClient,
        private filterFactory: FilterFactory
    ) { }

    /** @todo implement skip / take for pagination */
    public fetchLibrarys(start = 0, count = 20): Observable<IContentLibrary[]> {

        const url = '/qrs/ContentLibrary/table';
        const tableDefinition = {
            'entity': 'ContentLibrary',
            'columns': [
                { 'name': 'Id', 'columnType': 'Property', 'definition': 'id' },
                { 'name': 'Name', 'columnType': 'Property', 'definition': 'name' }
            ]
        };

        return this.http.post<ITableData>(url, tableDefinition)
            .pipe(
                map<ITableData, string[][]>((data: ITableData) => data.rows as string[][]),
                map<string[][], IContentLibrary[]>((rows) => rows.map((row) => ({id: row[0], name: row[1]})))
            );
    }

    /**
     * fetch static content from library
     */
    public fetchLibraryContent(libraryId, start = 0, count = 20, filter?): Observable<IStaticContent[]> {

        return this.createSelection(libraryId).pipe(
            /** we created a selection switch to static content references */
            switchMap((selection) => this.fetchSelectionData(selection.id, start, count, filter)),
            /** map data in 2 steps, first extract rows then convert to static content*/
            map<ITableData, string[][]>((data: ITableData) => data.rows as string[][]),
            map<string[][], IStaticContent[]>((rows) =>  rows.map<IStaticContent>((row) => {
                return {
                    id: row[0],
                    dataLocation: row[1],
                    externalPath: row[2],
                    logicalPath: row[3],
                };
            }))
        );
    }

    public uploadFile() {
    }

    /**
     * create new selection
     */
    private createSelection(libraryId: string) {
        /** @todo check we could use selection again and create not every time a new one, think about pagination */
        const url = `/qrs/Selection`;
        const items = [
            {type: 'ContentLibrary', objectId: libraryId}
        ];
        return this.http.post<ISelection>(url, {items});
    }

    /**
     * fetch static content references from selection
     * @todo implement skip / take for pagination
     */
    private fetchSelectionData(selectionId, start = 0, count = 20, filter?) {
        const url = `/qrs/Selection/${selectionId}/StaticContentReference/table`;
        const tableDefinition = {
            'entity': 'StaticContentReference',
            'columns': [
                { 'name': 'Id', 'columnType': 'Property', 'definition': 'id' },
                { 'name': 'DataLocation', 'columnType': 'Property', 'definition': 'dataLocation' },
                { 'name': 'ExternalPath', 'columnType': 'Property', 'definition': 'externalPath' },
                { 'name': 'LogicalPath', 'columnType': 'Property', 'definition': 'logicalPath' }
            ]
        };

        let params: HttpParams = new HttpParams();
        if (filter) {
            params = params.set('filter', this.filterFactory.createFilterQueryString(filter));
        }
        return this.http.post<ITableData>(url, tableDefinition, {params});
    }
}
