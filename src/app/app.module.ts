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
import { StartUpService, startUpServiceFactory, PageService } from './services';
import { configServiceFactory } from './services/config/config-service.factory';
import { ConfigFactory, CONFIGURATIONS } from './services/config/config-factory';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';

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
    DropDownModule,
    MenuModule,
    SerEngineModule
  ],
  providers: [
    PageService,
    StartUpService,
    ConfigFactory,
    {
      provide: 'SerEngineConfig',
      useFactory: configServiceFactory,
      deps: [ConfigFactory],
      multi: false
    },
    {
      provide: APP_INITIALIZER,
      useFactory: startUpServiceFactory,
      deps: [StartUpService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
