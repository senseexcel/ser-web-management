import { IDataNode } from '@smc/modules/smc-common';
import { importData } from '@smc/modules/smc-common/utils/import-data.decorator';

interface IDataModel {
    raw: IDataNode;
}

export class BookModel implements IDataModel {

    private bookTitle: string;

    private rawData: IDataNode;

    @importData
    public set raw(data: IDataNode) {
        this.rawData = data;
    }

    public get raw(): IDataNode {
        return this.rawData;
    }

    public set title(title: string) {
        this.bookTitle = title;
    }

    public get title(): string {
        return this.bookTitle;
    }
}
