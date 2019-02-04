import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  BreadcrumbModule,
  DropDownModule,
  MenuModule,
  ModalModule,
  QrsModule,
} from '@smc/modules';

import { AppsPage, ContentManagerPage, DashboardPage, LicensePage, TasksPage } from '@smc/pages';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { BootstrapService } from './services/bootstrap.service';
import { HttpClientModule } from '@angular/common/http';
import { IBootstrap } from './api/bootstrap.interface';

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
    HttpClientModule,

    /** smc modules */
    QrsModule,
    BreadcrumbModule,
    DropDownModule,
    MenuModule,
    ModalModule,

    /** pages */
    AppsPage,
    ContentManagerPage,
    DashboardPage,
    LicensePage,
    TasksPage,
  ],
  providers: [
    BootstrapService,
    {
      provide: APP_INITIALIZER,
      useFactory: (bootstrapService: IBootstrap) => {
        return () => bootstrapService.bootstrap();
      },
      deps: [BootstrapService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
