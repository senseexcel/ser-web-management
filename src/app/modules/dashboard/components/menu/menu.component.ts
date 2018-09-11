import { Component, OnInit, Inject } from '@angular/core';
import { Menu, MenuItem } from '@dashboard/api/menu.interface';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html'
})

export class MenuComponent implements OnInit {

    public menuItems: MenuItem[];

    constructor( @Inject('MenuData') menuData: Menu ) {
        this.menuItems = menuData.items;
    }

    ngOnInit() {}
}
