import { Component, OnInit, Inject } from '@angular/core';
import { IMenuItem } from '@smc/modules/menu/api/menu-item.interface';
import { DropDownOverlay } from '@smc/modules/drop-down/model/drop-down-overlay';
import { Router } from '@angular/router';
import { PAGE_SETTINGS } from '../../model/page.model';
import { ISessionUser } from '@smc/modules/qrs';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings } from '@smc/modules/smc-common';

@Component({
    selector: 'smc-top-bar',
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

    public loggedInUser: ISessionUser;

    /**
     * holds the current drop down overlay for an
     * open menu
     *
     * @private
     * @type {DropDownOverlay}
     * @memberof TopBarComponent
     */
    private dropDownOverlay: DropDownOverlay;

    constructor(
        @Inject(SMC_SESSION) private settings: ISettings,
        @Inject(PAGE_SETTINGS) private pages,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.loggedInUser = this.settings.loggedInUser;
        this.mainMenu = this.pages;
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

    public navigateStart() {
        this.router.navigate(['']);
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
            disabled: false,
            show: true,
            route: 'user/logout'
        }];
    }
}
