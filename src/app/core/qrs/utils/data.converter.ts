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
        return data.rows.reduce((previouseData: IDataNode[], qrsRow: Array<string | IDataNode>) => {
            const matRow: IDataNode = {};
            qrsRow.forEach((value, index) => {
                matRow[data.columnNames[index]] = value;
            });
            previouseData.push(matRow);
            return previouseData;
        }, []);
    }
}
