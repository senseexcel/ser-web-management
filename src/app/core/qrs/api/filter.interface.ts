export enum FilterOperator {
    EQUAL                 = 'eq',
    NOT_EQUAL             = 'ne',
    GREATER_THAN          = 'gt',
    GREATER_THAN_OR_EQUAL = 'ge',
    LESS_THAN             = 'lt',
    LESS_THAN_OR_EQUAL    = 'le',
    STARTS_WITH           = 'sw',
    ENDS_WITH             = 'ew',
    SUBSTRING_OF          = 'so'
}

export enum FilterConditionalOperator {
    AND = 'and',
    OR = 'or'
}

export interface IQrsFilter {

    by: string;

    value: string | number;

    operator: FilterOperator;
}

export interface IQrsFilterGroup {

    filters: IQrsFilter[];

    conditional: FilterConditionalOperator;

    addFilter(filter: IQrsFilter): void;
}
