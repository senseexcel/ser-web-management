import { Component, OnInit, Inject, Input } from '@angular/core';
import { IMenuItem } from '../../api/menu-item.interface';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss']
})

export class MenuComponent {

    @Input()
    public menuItems: IMenuItem[];
}
