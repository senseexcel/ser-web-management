import { Component,  Input } from '@angular/core';
import { IMenuItem } from '../../api/menu-item.interface';

@Component({
    selector: 'smc-ui-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss']
})

export class MenuComponent {

    @Input()
    public menuItems: IMenuItem[];
}
