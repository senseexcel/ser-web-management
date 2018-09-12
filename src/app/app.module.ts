import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from '@dashboard/dashboard.module';
import { BreadcrumbModule } from '@breadcrumb/breadcrumb.module';
import { AppsModule } from '@apps/apps.module';

import { menuData } from './api/data';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';
import * as SerEngineConfig from './config/ser-engine.config.json';

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
    SerEngineModule.forRoot(SerEngineConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
