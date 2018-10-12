import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, AppsComponent, AppNewComponent } from './components';
import { AppsRoutingModule } from './apps-routing.module';
import { MaterialModule } from '@core/modules/material.module';

import { ConnectionComponent, SettingsComponent, TemplateComponent, FormControlsComponent } from './components/edit';
import {
  DistributionComponent,
  DistributionFileComponent,
  DistributionHubComponent,
  DistributionMailComponent
} from './components/edit/form/distribution';

import { FormHelperModule } from '@core/modules/form-helper/form-helper.module';
import { SerAppModule } from '@core/modules/ser-app/ser-app.module';
import { ReportPreviewComponent } from '@apps/components/preview/preview.component';
import { ConvertEnumPipe } from '@core/pipes/convert-enum.pipe';
import { HJSonPipe } from '@core/pipes/hsjon.pipe';
import { SerTaskModule } from '@core/modules/ser-task/ser-task.module';
import { ListHeaderModule } from '@core/modules/list-header/list-header.module';
import { CoreModule } from '@core/core.module';
import { TasksComponent } from './components/tasks/task.component';
import { SelectionComponent } from '@apps/components/edit/form/selections/selection.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormHelperModule,
    MaterialModule,
    ReactiveFormsModule,
    SerAppModule,
    SerTaskModule,
    AppsRoutingModule,
    ListHeaderModule,
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
    HJSonPipe,
    ConvertEnumPipe
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
