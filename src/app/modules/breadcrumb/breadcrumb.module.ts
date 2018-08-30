import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbItemComponent } from './components/breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbService } from './provider/breadcrumb.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [BreadcrumbService],
  declarations: [BreadcrumbComponent, BreadcrumbItemComponent],
  exports: [ BreadcrumbComponent ]
})
export class BreadcrumbModule { }
