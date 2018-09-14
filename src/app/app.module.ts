import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from '@dashboard/dashboard.module';
import { BreadcrumbModule } from '@breadcrumb/breadcrumb.module';
import { AppsModule } from '@apps/apps.module';

import { menuData } from './api/data';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';
import { ISerEngineConfig } from '@core/modules/ser-engine/api/ser-engine-config.interface';

import { StartUpService, startUpServiceFactory } from './services';

let serEnigneConfig: ISerEngineConfig;
/// #if ! DEV
serEnigneConfig = {
  host: window.location.host,
  virtualProxy: ''
};
/// #else
import * as SerEngineDevConfig from './config/ser-engine.config.dev.json';
serEnigneConfig = SerEngineDevConfig;
/// #endif

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    AppsModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    BrowserModule,
    DashboardModule.forRoot(menuData),
    SerEngineModule.forRoot(serEnigneConfig)
  ],
  providers: [
    StartUpService,
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
