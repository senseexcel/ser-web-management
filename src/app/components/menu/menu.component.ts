import { Component, OnInit, Inject } from '@angular/core';
import { PageService } from '../../services';
import { IMenuGroup } from '@api/menu-item.interface';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss']
})

export class MenuComponent implements OnInit {

    public menuGroups: IMenuGroup[];

    private pageService: PageService;

    constructor(pageService: PageService) {
        this.pageService = pageService;
    }

    ngOnInit() {
        this.menuGroups = this.pageService.getMenuGroups();
    }
}
