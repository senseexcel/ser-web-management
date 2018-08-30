import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DashboardModule } from '@dashboard/dashboard.module';
import { BreadcrumbModule } from '@breadcrumb/breadcrumb.module';
import { QlikModule } from '@qlik/qlik.module';

import { menuData } from './api/data';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    BrowserModule,
    DashboardModule.forRoot(menuData),
    QlikModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
