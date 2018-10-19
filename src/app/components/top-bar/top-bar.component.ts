import { Component, OnInit, Inject } from '@angular/core';
import { PageService } from '../../services';
import { IMenuItem } from '@core/modules/menu/api/menu-item.interface';
import { DropDownOverlay } from '@core/modules/drop-down/model/drop-down-overlay';
import { AppData } from '@core/model/app-data';
import { IDomainUser } from 'ser.api';

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

    public loggedInUser: IDomainUser;

    /**
     * holds the current drop down overlay for an
     * open menu
     *
     * @private
     * @type {DropDownOverlay}
     * @memberof TopBarComponent
     */
    private dropDownOverlay: DropDownOverlay;

    /**
     * page service to fetch main menu
     *
     * @private
     * @type {PageService}
     * @memberof TopBarComponent
     */
    private pageService: PageService;

    private appData: AppData;

    constructor(
        @Inject('AppData') appData,
        pageService: PageService,
    ) {
        this.pageService = pageService;
        this.appData = appData;
    }

    ngOnInit() {
        this.loggedInUser = this.appData.user;
        this.mainMenu = this.pageService.pageData;
        this.helpMenu = this.createHelpMenu();
        this.userMenu = this.createUserMenu();
    }

    /**
     * handle event drop down overlay is shown if we allready have an overlay
     * open close it.
     *
     * @param {DropDownOverlay} overlay
     * @memberof TopBarComponent
     */
    public showMenuOverlay(overlay: DropDownOverlay) {
        if (this.dropDownOverlay && overlay !== this.dropDownOverlay) {
            this.dropDownOverlay.close();
        }
        this.dropDownOverlay = overlay;
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
