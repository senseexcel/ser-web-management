import { ITableData } from '@smc/modules/qrs/api/table.interface';
import { IDataNode } from '@smc/modules/smc-common';

export class DataConverter {

    /**
     * convert qrs table data to material table data
     *
     * @static
     * @memberof
     */
    public static convertQrsTableToJson(data: ITableData): IDataNode[] {

        if (!data.rows.length) {
            return [];
        }

        const rows = data.rows as IDataNode[][];
        return rows.reduce(
            (previouseData, qrsRow) => {
                const matRow: IDataNode = {};
                qrsRow.forEach( ( value, index ) => {
                    matRow[data.columnNames[index]] = value;
                } );
                previouseData.push( matRow );
                return previouseData;
            },
            []
        );
    }
}
