import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  BootstrapModule,
  BreadcrumbModule,
  DropDownModule,
  MenuModule,
  ModalModule,
  SmcCommonModule,
  QrsModule,
} from '@smc/modules';

import { AppsPage, ContentManagerPage, DashboardPage, LicensePage } from '@smc/pages';
import { TopBarComponent } from './components/top-bar/top-bar.component';

/**
 *
 *
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
  ],
  entryComponents: [],
  imports: [

    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,

    /** smc modules */
    BootstrapModule,
    BreadcrumbModule,
    DropDownModule,
    MenuModule,
    ModalModule,
    SmcCommonModule,

    /** pages */
    AppsPage,
    ContentManagerPage,
    DashboardPage,
    LicensePage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
