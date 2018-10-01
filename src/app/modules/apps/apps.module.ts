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
import { HJSonPipe } from '@core/pipes/hsjon.pipe';
import { SerTaskModule } from '@core/modules/ser-task/ser-task.module';

@NgModule({
  imports: [
    CommonModule,
    FormHelperModule,
    MaterialModule,
    ReactiveFormsModule,
    SerAppModule,
    SerTaskModule,
    AppsRoutingModule
  ],
  exports: [MaterialModule],
  declarations: [
    AppEditComponent,
    AppListComponent,
    AppsComponent,
    ConnectionComponent,
    FormControlsComponent,
    SettingsComponent,
    TemplateComponent,
    DistributionComponent,
    DistributionFileComponent,
    DistributionHubComponent,
    DistributionMailComponent,
    AppNewComponent,
    ReportPreviewComponent,
    HJSonPipe,
  ],
  entryComponents: [
    AppsComponent,
    AppNewComponent,
    AppListComponent,
    AppEditComponent,
    ReportPreviewComponent
  ]
})
export class AppsModule { }
