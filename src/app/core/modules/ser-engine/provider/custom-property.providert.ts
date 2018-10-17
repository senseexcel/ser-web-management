import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomProperty, CustomPropertyObjectType } from '../api/custom-property.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SerFilterService } from './ser-filter.service';
import { ISerEngineConfig } from '../api/ser-engine-config.interface';
import { IQrsCustomProperty } from '../api/response/qrs/custom-property.interface';

@Injectable()
export class CustomPropertyProvider {

    private httpClient: HttpClient;

    private filterProvider: SerFilterService;

    private configProvider: ISerEngineConfig;

    /**
     *
     *
     * @private
     * @memberof CustomPropertyProvider
     */
    private endpoint = '/qrs/CustomPropertyDefinition';

    constructor(
        http: HttpClient,
        filter: SerFilterService,
        @Inject('SerEngineConfig') config: ISerEngineConfig
    ) {
        this.httpClient = http;
        this.filterProvider = filter;
        this.configProvider = config;
    }

    /**
     *
     *
     * @param {string} [name='sense_excel_reporting']
     * @returns {Observable<ICustomProperty[]>}
     * @memberof CustomPropertyProvider
     */
    public fetchCustomProperties(name = 'senseExcelReporting'): Observable<IQrsCustomProperty[]> {

        const filter = this.filterProvider.createFilter('name', `'${name}'`);
        const url = this.endpoint;

        let params: HttpParams = new HttpParams();

        if (filter) {
            params = params.set('filter', this.filterProvider.createFilterQueryString(filter));
        }

        return this.httpClient.get(url, { params, withCredentials: true }) as Observable<IQrsCustomProperty[]>;
    }

    /**
     *
     *
     * @memberof CustomPropertyProvider
     */
    public createCustomProperty(name, objectTypes: CustomPropertyObjectType[]) {

        const url = this.endpoint;
        const customProperty: ICustomProperty = {
            name,
            description: 'sense-excel-reporting custom property',
            choiceValues: ['sense-excel-reporting-task', 'sense-excel-reporting-app'],
            objectTypes: objectTypes,
            valueType: 'Text'
        };

        return this.httpClient.post(url, customProperty);
    }
}
