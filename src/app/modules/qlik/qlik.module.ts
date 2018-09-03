import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, QlikAppComponent } from './components';
import { QlikRoutingModule } from './qlik-routing.module';
import { MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import { SerAppProvider } from '@qlik/provider/ser-app.provider';
import { DistributionModule } from '@distribution/distribution.module';
import { ConnectionComponent, GeneralComponent, TemplateComponent } from './components/edit';

@NgModule({
  imports: [
    CommonModule,
    DistributionModule,
    MatProgressSpinnerModule,
    MatTableModule,
    QlikRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppEditComponent,
    AppListComponent,
    QlikAppComponent,
    ConnectionComponent,
    GeneralComponent,
    TemplateComponent,
  ],
  entryComponents: [
    ConnectionComponent,
    GeneralComponent,
    TemplateComponent,
  ],
  providers: [
    SerAppProvider
  ]
})
export class QlikModule { }
