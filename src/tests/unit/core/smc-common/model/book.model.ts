import { IDataNode, IModel } from '@smc/modules/smc-common';
import { importData } from '@smc/modules/smc-common/utils/model/import-data.decorator';
import { Validate, Validators } from '@smc/modules/smc-common/utils/model/validate-property.decorator';

export class BookModel implements IModel<IDataNode> {

    private bookTitle: string;

    private rawData: IDataNode;

    @importData
    public set raw(data: IDataNode) {
        this.rawData = data;
    }

    public get raw(): IDataNode {
        return this.rawData;
    }

    @Validate([Validators.isString])
    public set title(title: string) {
        this.bookTitle = title;
    }

    public get title(): string {
        return this.bookTitle;
    }
}
