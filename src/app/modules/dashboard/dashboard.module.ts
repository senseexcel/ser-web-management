import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent, MenuComponent } from './components';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    DashboardComponent,
    MenuComponent
  ],
  exports: [
    DashboardComponent
  ],
  entryComponents: [
    DashboardComponent
  ]
})
export class DashboardModule {

  public static forRoot(menu): ModuleWithProviders {

    return {
      ngModule: DashboardModule,
      providers: [{
        provide: 'MenuData', useValue: menu
      }]
    };
  }
}
