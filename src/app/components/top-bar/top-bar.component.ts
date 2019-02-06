import { Component, OnInit, Inject } from '@angular/core';
import { DropDownOverlay } from '@smc/modules/drop-down/model/drop-down-overlay';
import { Router } from '@angular/router';
import { ISessionUser } from '@smc/modules/qrs';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings, SmcCache, IDataNode } from '@smc/modules/smc-common';
import { IMenuItem } from '@smc/modules/smc-ui/api';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'smc-top-bar',
    templateUrl: 'top-bar.component.html',
    styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

    public mainMenu: IMenuItem[];
    public helpMenu: IMenuItem[];
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
        @Inject(SMC_SESSION)  private session: ISettings,
        private settings: SettingsService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.loggedInUser = this.session.loggedInUser;
        this.mainMenu = this.settings.menu;
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
            label: 'Setup after Installation',
            disabled: true,
            show: true
        }, {
            label: 'Keyboard Shortcuts',
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
            label: 'Logout',
            disabled: false,
            show: true,
            route: 'user/logout'
        }];
    }
}
