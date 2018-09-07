import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, AppsComponent } from './components';
import { AppsRoutingModule } from './apps-routing.module';
import {
  MatTableModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatTabsModule
} from '@angular/material';
import { ConnectionComponent, SettingsComponent, TemplateComponent, FormControlsComponent } from './components/edit';
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
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
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
    DistributionMailComponent
  ]
})
export class AppsModule { }
