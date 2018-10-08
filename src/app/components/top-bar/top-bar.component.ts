import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services';
import { IMenuGroup } from '@core/modules/menu/api/menu-item.interface';

@Component({
    selector: 'app-top-bar',
    templateUrl: 'top-bar.component.html',
    styleUrls: ['./top-bar.component.scss']
})

export class TopBarComponent implements OnInit {

    public menuGroups: IMenuGroup[];

    private pageService: PageService;

    constructor(pageService: PageService) {
        this.pageService = pageService;
    }

    ngOnInit() {
        this.menuGroups = this.pageService.getMenuGroups();
     }
}
