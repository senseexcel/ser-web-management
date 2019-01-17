import { NgModule } from '@angular/core';

import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        MenuComponent
    ],
    exports: [MenuComponent],
    imports: [CommonModule, RouterModule]
})
export class MenuModule { }
