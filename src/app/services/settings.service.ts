import { Injectable, Inject } from '@angular/core';
import { IAppSettings } from '../api/app-settings.interface';
import { AppSettingsFactory } from '../util/app-settings-service.factory';
import { IAppPage } from '@api/app-page.interface';
import { IMenuItem } from '@smc/modules/smc-ui/api';
import { IAppSection } from '@api/app-section.interface';
import { PageModel } from '../model/page.model';

@Injectable({
    providedIn: 'root',
    useFactory: AppSettingsFactory
})
export class SettingsService {

    constructor(
        private appSettings: IAppSettings,
    ) {
    }

    /**
     * get menu from page settings
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
     * get only pages without sections
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
