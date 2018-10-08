import { Component, OnInit, Inject, Input } from '@angular/core';
import { IMenuGroup } from '@api/menu-item.interface';
import { IMenuItem } from '../../api/menu-item.interface';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss']
})

export class MenuComponent {

    @Input()
    public menuGroups: IMenuGroup[];

    @Input()
    public menuItems: IMenuItem[];
}
