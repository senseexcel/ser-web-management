import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerModule, SmcUiModule } from '@smc/modules';
import { AppListComponent } from './components/list.component';

export const AppListRoutes = [{
    path: '',
    component: AppListComponent
}];

@NgModule({
    imports: [
        CommonModule,
        SmcUiModule
    ],
    exports: [ AppListComponent ],
    declarations: [ AppListComponent ],
    entryComponents: [ AppListComponent ],
    providers: [SerModule],
})
export class List { }
