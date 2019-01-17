import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';

import { AppEditComponent, AppListComponent, AppsComponent, AppNewComponent } from './components';
import { ConnectionComponent, SettingsComponent, TemplateComponent, FormControlsComponent } from './components/edit';
import {
  DistributionComponent,
  DistributionFileComponent,
  DistributionHubComponent,
  DistributionMailComponent
} from './components/edit/form/distribution';

import { TasksComponent } from './components/tasks/task.component';
import { ReportPreviewComponent } from './components/preview/preview.component';
import { SelectionComponent } from './components/edit/form/selections/selection.component';

import { FormHelperModule, MaterialModule, SerModule, SmcCommonModule } from '@smc/modules';
import { QrsModule } from '@smc/modules/qrs/qrs.module';

@NgModule({
  imports: [
    CommonModule,
    FormHelperModule,
    MaterialModule,
    ReactiveFormsModule,
    AppsRoutingModule,
    QrsModule,
    SmcCommonModule,
    SerModule,
  ],
  exports: [MaterialModule],
  declarations: [
    AppEditComponent,
    AppListComponent,
    AppsComponent,
    ConnectionComponent,
    FormControlsComponent,
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
  ]
})
export class AppsModule { }
