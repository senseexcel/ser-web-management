import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from '@dashboard/dashboard.module';
import { BreadcrumbModule } from '@breadcrumb/breadcrumb.module';
import { AppsModule } from '@apps/apps.module';

import { menuData } from './api/data';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';

import { StartUpService, startUpServiceFactory } from './services';
import { configServiceFactory } from './services/config/config-service.factory';
import { ConfigFactory, CONFIGURATIONS } from './services/config/config-factory';

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
    SerEngineModule
  ],
  providers: [
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
