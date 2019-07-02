import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { FormHelperModule, MaterialModule, SerModule, SmcUiModule } from '@smc/modules';
import { QrsModule } from '@smc/modules/qrs/qrs.module';
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

import { AppsServiceModule } from './apps-service.module';
import { TranslateService } from '@ngx-translate/core';

import i18n_en from './i18n/en.json';

import { TemplateSelectionsModule } from '@modules/template-selections/template-selections.module';
import { TemplateInputModule } from '@modules/template-input/template-input.module';

@NgModule({
  imports: [
    AppsServiceModule,
    FormHelperModule,
    ReactiveFormsModule,
    AppsRoutingModule,
    QrsModule,
    SerModule,
    SmcUiModule,
    TemplateInputModule,
    TemplateSelectionsModule,
    DragDropModule
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
    TasksComponent,
  ],
  providers: []
})
export class AppsModule {
    public constructor(i18n: TranslateService) {
        i18n.setTranslation('en', i18n_en, true);
    }
}
