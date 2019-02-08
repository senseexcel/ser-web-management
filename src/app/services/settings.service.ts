import { Injectable, Inject, Optional } from '@angular/core';
import { IAppSettings } from '../api/app-settings.interface';
import { IAppPage } from '@api/app-page.interface';
import { IMenuItem } from '@smc/modules/smc-ui/api';
import { IAppSection } from '@api/app-section.interface';
import { PageModel } from '../model/page.model';
import { AppSettingsModel } from '../model/app-settings.model';
import { AppPageSettings } from '../settings/page.settings';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    private appSettings: IAppSettings = new AppSettingsModel();

    public constructor() {
        this.appSettings = new AppSettingsModel();
        this.appSettings.sections = AppPageSettings;
    }

    /**
     * extract sections and pages from page settings and convert to menu data
     *
     * @readonly
     * @type {IMenuItem[]}
     * @memberof SettingsService
     */
    public get menu(): IMenuItem[] {
        return this.appSettings.sections.map((section: IAppSection) => {
            const menuGroup: IMenuItem = {
                label: `SMC_MENU.GROUP.${section.title.toUpperCase().replace(/\s/, '_')}`,
                disabled: false,
                show: true
            };

            if (section.pages.length > 0) {
                menuGroup.children = section.pages.map((page: PageModel): IMenuItem => {
                    return {
                        ...page.raw,
                        label: `SMC_MENU.ITEM.${page.id.toUpperCase()}`
                    };
                });
            }
            return menuGroup;
        });
    }

    /**
     * flatten page settings and return only packages
     *
     * @readonly
     * @type {IAppPage[]}
     * @memberof SettingsService
     */
    public get pages(): IAppPage[] {
        return this.appSettings.sections.reduce<IAppPage[]>((pages, section) => {
            return [...pages, ...section.pages];
        }, []);
    }
}
