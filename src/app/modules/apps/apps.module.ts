import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, QlikAppComponent } from './components';
import { QlikRoutingModule } from './apps-routing.module';
import {
  MatTableModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatTabsModule
} from '@angular/material';
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
    CommonModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    QlikRoutingModule,
    ReactiveFormsModule,
    SerAppModule
  ],
  declarations: [
    AppEditComponent,
    AppListComponent,
    QlikAppComponent,
    ConnectionComponent,
    FormControlsComponent,
    GeneralComponent,
    TemplateComponent,
    DistributionComponent,
    DistributionFileComponent,
    DistributionHubComponent,
    DistributionMailComponent
  ]
})
export class AppsModule { }
