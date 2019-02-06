import { IAppPage } from '@api/app-page.interface';
import { IDataNode } from '@smc/modules/smc-common';

interface I18NData {
    key: string;
    param?: IDataNode;
}

export interface ITile extends IAppPage {
    title: I18NData;
    description: I18NData;
}
