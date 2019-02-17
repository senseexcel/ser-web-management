import { SectionModel } from './section.model';
import { mapDataTo } from '@smc/modules/smc-common/utils';
import { IAppSection } from '@api/app-section.interface';
import { IAppSettings } from '@api/app-settings.interface';

export class AppSettingsModel implements IAppSettings {

    private appSections: IAppSection[];

    @mapDataTo<SectionModel>(SectionModel)
    public set sections(sections: IAppSection[]) {
        this.appSections = sections;
    }

    public get sections(): IAppSection[] {
        return this.appSections;
    }
}
