import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbModule } from '@breadcrumb/breadcrumb.module';
import { AppsModule } from '@apps/apps.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';

import { StartUpService, startUpServiceFactory, PageService } from './services';
import { configServiceFactory } from './services/config/config-service.factory';
import { ConfigFactory, CONFIGURATIONS } from './services/config/config-factory';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenuComponent
  ],
  entryComponents: [DashboardComponent],
  imports: [
    AppRoutingModule,
    AppsModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    BrowserModule,
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
