import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';

import { AppEditComponent, AppListComponent, AppsComponent, AppNewComponent } from './components';
import { ConnectionComponent, SettingsComponent, TemplateComponent } from './components/edit';
import {
  DistributionComponent,
  DistributionFileComponent,
  DistributionHubComponent,
  DistributionMailComponent
} from './components/edit/form/distribution';

import { TasksComponent } from './components/tasks/task.component';
import { ReportPreviewComponent } from './components/preview/preview.component';
import { SelectionComponent } from './components/edit/form/selections/selection.component';

import { FormHelperModule, MaterialModule, SerModule, SmcCommonModule, SmcUiModule } from '@smc/modules';
import { QrsModule } from '@smc/modules/qrs/qrs.module';
import { AppsServiceModule } from './apps-service.module';
import { TranslateService } from '@ngx-translate/core';

import i18n_en from './i18n/en.json';

@NgModule({
  imports: [
    AppsServiceModule,
    CommonModule,
    FormHelperModule,
    MaterialModule,
    ReactiveFormsModule,
    AppsRoutingModule,
    QrsModule,
    SerModule,
    SmcCommonModule,
    SmcUiModule
  ],
  exports: [MaterialModule],
  declarations: [
    AppEditComponent,
    AppListComponent,
    AppsComponent,
    ConnectionComponent,
    SettingsComponent,
    TasksComponent,
    TemplateComponent,
    DistributionComponent,
    DistributionFileComponent,
    DistributionHubComponent,
    DistributionMailComponent,
    SelectionComponent,
    AppNewComponent,
    ReportPreviewComponent,
  ],
  entryComponents: [
    AppsComponent,
    AppNewComponent,
    AppListComponent,
    AppEditComponent,
    ReportPreviewComponent,
    TasksComponent
  ],
  providers: []
})
export class AppsModule {
    public constructor(i18n: TranslateService) {
        i18n.setTranslation('en', i18n_en, true);
    }
}
