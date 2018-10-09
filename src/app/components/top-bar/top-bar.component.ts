import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services';
import { IMenuItem } from '@core/modules/menu/api/menu-item.interface';

@Component({
    selector: 'app-top-bar',
    templateUrl: 'top-bar.component.html',
    styleUrls: ['./top-bar.component.scss']
})

export class TopBarComponent implements OnInit {

    /**
     * main menu
     *
     * @type {IMenuGroup[]}
     * @memberof TopBarComponent
     */
    public mainMenu: IMenuItem[];

    /**
     * help menu
     *
     * @type {IMenuItem[]}
     * @memberof TopBarComponent
     */
    public helpMenu: IMenuItem[];

    /**
     * user menu
     *
     * @type {IMenuItem[]}
     * @memberof TopBarComponent
     */
    public userMenu: IMenuItem[];

    /**
     * page service to fetch main menu
     *
     * @private
     * @type {PageService}
     * @memberof TopBarComponent
     */
    private pageService: PageService;

    constructor(pageService: PageService) {
        this.pageService = pageService;
    }

    ngOnInit() {
        this.mainMenu = this.pageService.pageData;
        this.helpMenu = this.createHelpMenu();
        this.userMenu = this.createUserMenu();
    }

    /**
     * create help menu items
     *
     * @private
     * @returns {IMenuItem[]}
     * @memberof TopBarComponent
     */
    private createHelpMenu(): IMenuItem[] {
        return [{
            name: 'Setup after Installation',
            disabled: true,
            show: true
        }, {
            name: 'Keyboard Shortcuts',
            disabled: true,
            show: true
        }];
    }

    /**
     * create logout menu items
     *
     * @private
     * @returns {IMenuItem[]}
     * @memberof TopBarComponent
     */
    private createUserMenu(): IMenuItem[] {
        return [{
            name: 'Logout',
            disabled: true,
            show: true
        }];
    }
}
