import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEditComponent, AppListComponent, AppNewComponent, QlikAppComponent } from './components';
import { QlikRoutingModule } from './qlik-routing.module';
import { SerEngineModule } from '../serapi/serapi.module';
import { MatTableModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    QlikRoutingModule,
    SerEngineModule,
  ],
  declarations: [
    AppEditComponent,
    AppListComponent,
    AppNewComponent,
    QlikAppComponent
  ]
})
export class QlikModule { }
