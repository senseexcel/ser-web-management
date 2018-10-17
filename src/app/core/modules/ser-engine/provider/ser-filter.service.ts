import { Injectable } from '@angular/core';
import { IQrsFilter, FilterConditionalOperator, IQrsFilterGroup, FilterOperator } from '../api/filter.interface';
import { FilterGroup } from '../model/filter-group.model';
import { FilterModel } from '@core/modules/ser-engine/model/filter.model';

@Injectable()
export class SerFilterService {

    /**
     * create qrs filter group
     *
     * @param {IQrsFilter[]} filters
     * @param {*} [conditional=FilterConditionalOperator.AND]
     * @returns {IQrsFilterGroup}
     * @memberof SerFilterService
     */
    public createFilterGroup(filters: IQrsFilter[], conditional = FilterConditionalOperator.AND): IQrsFilterGroup  {
        const filterGroup: FilterGroup = new FilterGroup();
        filterGroup.filters = filters;
        filterGroup.conditional = conditional || FilterConditionalOperator.AND;
        return filterGroup;
    }

    /**
     * create qrs filter
     *
     * @param {string} by
     * @param {(string | number)} value
     * @param {FilterOperator} [operator]
     * @returns {IQrsFilter}
     * @memberof SerFilterService
     */
    public createFilter(by: string, value: string | number, operator?: FilterOperator): IQrsFilter {
        const filter: IQrsFilter = new FilterModel();
        filter.by = by;
        filter.value = value;
        filter.operator = operator || FilterOperator.EQUAL;
        return filter;
    }

    /**
     * create query string for filter
     * @todo handle multiple groups
     *
     * @param {(IQrsFilter | IQrsFilterGroup)} filter
     * @returns {string}
     * @memberof SerFilterService
     */
    public createFilterQueryString(filter: IQrsFilterGroup | IQrsFilter): string {

        /** sanitize filters to be a group */
        if ( filter instanceof FilterModel ) {
            filter = this.createFilterGroup([filter]);
        }

        const groupedFilter = filter as IQrsFilterGroup;

        return groupedFilter.filters.reduce( (query: string, qrsFilter: IQrsFilter) => {
            const filterQuery = `${qrsFilter.by} ${qrsFilter.operator} ${qrsFilter.value}`;

            if ( query.length ) {
                query += ` ${groupedFilter.conditional}`;
            }

            return `${query} ${filterQuery}`;
        }, '');
    }
}
