import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule, DropDownModule, ModalModule, QrsModule, SmcUiModule } from '@smc/modules';

import { AppsPage, ContentManagerPage, DashboardPage, LicensePage, TasksPage } from '@smc/pages';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { BootstrapService } from './services/bootstrap.service';
import { IBootstrap } from './api/bootstrap.interface';
import i18n_en from './i18n/en.json';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
  ],
  entryComponents: [],
  imports: [

    TranslateModule.forRoot(),

    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,

    /** smc modules */
    QrsModule,
    BreadcrumbModule,
    DropDownModule,
    ModalModule,
    SmcUiModule,

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

  public constructor(i18n: TranslateService) {
    i18n.setTranslation('en', i18n_en, true);
    i18n.setDefaultLang('en');
  }
}
