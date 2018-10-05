import { Injectable } from '@angular/core';
import { IPage } from '@api/page.interface';
import { IMenuItem, IMenuGroup } from '@api/menu-item.interface';
import PageConfig from '../config/page.config.json';
import { ReturnStatement } from '@angular/compiler';

@Injectable()
export class PageService {

    private pages: IPage[];

    /**
     * get page data by name
     *
     * @param name
     */
    public getPageData(name?: string): IPage[] {

        let pages: IPage[] = PageConfig.slice();

        if (name) {
            pages = PageConfig.filter((page: IPage) => {
                return page.name === name;
            });
        }

        /** create clone so page data could not be modified */
        return JSON.parse(JSON.stringify(pages));
    }

    /**
     * read page configuration and convert to array
     */
    public getMenuItems(): IMenuItem[] {
        const menuItems: IMenuItem[] = [];
        PageConfig.forEach((page: IPage) => {
            menuItems.push({
                group: page.group || null,
                icon: page.icon,
                disabled: page.disabled,
                name: page.name,
                route: page.route,
            });
        });
        return menuItems;
    }

    /**
     * get menu groups
     */
    public getMenuGroups(): IMenuGroup[] {
        const groups: IMenuGroup[] = [];
        const menuItems     = this.getMenuItems();
        const groupNames    = [];

        menuItems.forEach((menuItem) => {
            let group: IMenuGroup;
            if (groupNames.indexOf(menuItem.group) > -1) {
                group = groups[groupNames.indexOf(menuItem.group)];
            } else {
                group = {
                    name: menuItem.group,
                    items: []
                };
                groupNames.push(menuItem.group);
                groups.push(group);
            }
            group.items.push(menuItem);
        });

        return groups;
    }
}
