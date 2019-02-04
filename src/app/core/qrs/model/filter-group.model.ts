import { IQrsFilterGroup, IQrsFilter, FilterConditionalOperator } from '../api/filter.interface';

export class FilterGroup implements IQrsFilterGroup {

    private fgFilters: IQrsFilter[];

    private fgConditional: FilterConditionalOperator;

    /**
     * set filters which should grouped
     *
     * @memberof FilterGroup
     */
    public set filters(filter: IQrsFilter[]) {
        this.fgFilters = filter;
    }

    /**
     * add new filter
     *
     * @param {IQrsFilter} filter
     * @memberof FilterGroup
     */
    public addFilter(filter: IQrsFilter) {
        this.fgFilters.push(filter);
    }

    /**
     * get filters which should grouped
     *
     * @type {IQrsFilter[]}
     * @memberof FilterGroup
     */
    public get filters():  IQrsFilter[] {
        return this.fgFilters;
    }

    /**
     * set conditional filter for group
     *
     * @memberof FilterGroup
     */
    public set conditional(cond: FilterConditionalOperator) {
        this.fgConditional = cond;
    }

    /**
     * get conditional operator for filter group
     *
     * @type {FilterConditionalOperator}
     * @memberof FilterGroup
     */
    public get conditional(): FilterConditionalOperator {
        return this.fgConditional || FilterConditionalOperator.AND;
    }
}
