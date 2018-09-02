import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, QlikAppComponent } from './components';
import { QlikRoutingModule } from './qlik-routing.module';
import { MatTableModule } from '@angular/material';
import { SerAppProvider } from '@qlik/provider/ser-app.provider';
import { DistributionModule } from '@distribution/distribution.module';

@NgModule({
  imports: [
    CommonModule,
    DistributionModule,
    MatTableModule,
    QlikRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppEditComponent,
    AppListComponent,
    QlikAppComponent
  ],
  providers: [
    SerAppProvider
  ]
})
export class QlikModule { }
