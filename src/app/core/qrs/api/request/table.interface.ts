interface ITableColumn {
    name: string;
    columnType: 'Property';
    definition: string;
}

export interface ITable {

    entity: string;

    columns: ITableColumn[];
}
