import { IQrsFilter, FilterOperator } from '../api/filter.interface';

export class FilterModel implements IQrsFilter {

    private filterBy: string;

    private filterValue: string | number;

    private filterOperator: FilterOperator;

    /**
     * get property which should filtered by
     *
     * @type {string}
     * @memberof FilterModel
     */
    public get by(): string {
        return this.filterBy;
    }

    /**
     * get value which should match by filter
     *
     * @type {(string | number)}
     * @memberof FilterModel
     */
    public get value(): string | number {
        return this.filterValue;
    }

    /**
     * get the filteroperator default FilterOperator.EQUAL
     *
     * @type {FilterOperator}
     * @memberof FilterModel
     */
    public get operator(): FilterOperator {
        return this.filterOperator || FilterOperator.EQUAL;
    }

    /**
     * set by which property should be filtered
     *
     * @memberof FilterModel
     */
    public set by(by: string) {
        this.filterBy = by;
    }

    /**
     * set value to match filter
     *
     * @memberof FilterModel
     */
    public set value(value: string | number) {
        this.filterValue = value;
    }

    /**
     * set filter operator default FilterOperator.EQUAL
     *
     * @memberof FilterModel
     */
    public set operator(operator: FilterOperator) {
        this.filterOperator = operator;
    }
}
