import { IDataNode } from '@smc/modules/smc-common';

export interface ITableData {
    id: 'string';
    columnNames: string[];
    rows: IDataNode[][] | string[][];
}
