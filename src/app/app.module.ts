import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbModule } from '@breadcrumb/breadcrumb.module';
import { AppsModule } from '@apps/apps.module';

import { DropDownModule } from '@core/modules/drop-down/drop-down.module';
import { MenuModule } from '@core/modules/menu/menu.module';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageService } from './services';
import { configServiceFactory } from './services/config/config-service.factory';
import { ConfigFactory } from './services/config/config-factory';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { CoreModule } from '@core/core.module';
import { CommonModule } from '@angular/common';
import { UserModule } from '@core/modules/user/user.module';
import { LicenseModule } from './modules/ser-license/license.module';
import { ModalModule } from '@core/modules/modal/modal.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TopBarComponent
  ],
  entryComponents: [DashboardComponent],
  imports: [
    AppRoutingModule,
    AppsModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    CoreModule,
    DropDownModule,
    LicenseModule,
    MenuModule,
    ModalModule,
    SerEngineModule,
    UserModule
  ],
  providers: [
    PageService,
    ConfigFactory,
    {
      provide: 'SerEngineConfig',
      useFactory: configServiceFactory,
      deps: [ConfigFactory],
      multi: false
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
