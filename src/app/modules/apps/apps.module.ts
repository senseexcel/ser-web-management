import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, AppsComponent, AppNewComponent } from './components';
import { AppsRoutingModule } from './apps-routing.module';
import { MaterialModule } from '@core/modules/material.module';

import { ConnectionComponent, GeneralComponent, TemplateComponent, FormControlsComponent } from './components/edit';
import {
  DistributionComponent,
  DistributionFileComponent,
  DistributionHubComponent,
  DistributionMailComponent
} from './components/edit/form/distribution';
import { SerAppModule } from '@core/ser-app/ser-app.module';


@NgModule({
  imports: [
    AppsRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SerAppModule
  ],
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
    AppNewComponent
  ]
})
export class AppsModule { }
