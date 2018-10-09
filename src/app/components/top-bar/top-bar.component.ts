import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services';
import { IMenuItem } from '@core/modules/menu/api/menu-item.interface';
import { DropDownOverlay } from '@core/modules/drop-down/model/drop-down-overlay';
import { SerUserService } from '@core/modules/ser-engine/provider/ser-user.service';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';

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

    private userApiService: SerUserService;

    private filterService: SerFilterService;

    constructor(
        pageService: PageService,
        userApiService: SerUserService,
        filterService: SerFilterService
    ) {
        this.pageService    = pageService;
        this.userApiService = userApiService;
        this.filterService  = filterService;
    }

    ngOnInit() {

        this.loggedInUser()
        .subscribe( (users: any[]) => {
            this.loggedInUser = users[0];
        });

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

    private loggedInUser() {
        const userFilter = this.filterService.createFilter(
            'userDirectory',
            `'${window.location.hostname}'`
        );

        return this.userApiService.fetchUsers(userFilter);
    }
}
