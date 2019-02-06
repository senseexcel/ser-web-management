import { PageModel } from './page.model';
import { mapDataTo, importData } from '@smc/modules/smc-common/utils';
import { IDataNode } from '@smc/modules/smc-common/api';
import { IAppSection } from '@api/app-section.interface';
import { IAppPage } from '@api/app-page.interface';

export class SectionModel implements IAppSection {

    private rawData: IDataNode;
    private sectionId: string;
    private sectionPages: IAppPage[];
    private sectionTitle: string;

    public get title(): string {
        return this.sectionTitle;
    }

    public set title(title: string) {
        this.sectionTitle = title;
    }

    public set id(id: string) {
        this.sectionId = id;
    }

    public get id(): string {
        return this.sectionId;
    }

    @mapDataTo<PageModel>(PageModel)
    public set pages(pages: IAppPage[]) {
        this.sectionPages = pages;
    }

    public get pages(): IAppPage[] {
        return this.sectionPages;
    }

    @importData
    public set raw(data: IDataNode) {
        this.rawData = data;
    }

    public get raw(): IDataNode {
        return this.rawData;
    }
}
