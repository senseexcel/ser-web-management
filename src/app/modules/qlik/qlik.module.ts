import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, QlikAppComponent } from './components';
import { QlikRoutingModule } from './qlik-routing.module';
import { MatTableModule, MatProgressSpinnerModule, MatInputModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { DistributionModule } from '@distribution/distribution.module';
import { SerAppModule } from '@ser-app/ser-app.module';
import { ConnectionComponent, GeneralComponent, TemplateComponent, FormControlsComponent } from './components/edit';

@NgModule({
  imports: [
    CommonModule,
    DistributionModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
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
  ],
  entryComponents: [
    ConnectionComponent,
    GeneralComponent,
    TemplateComponent,
  ]
})
export class QlikModule { }
