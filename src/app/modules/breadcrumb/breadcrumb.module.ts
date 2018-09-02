import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbItemComponent } from './components/breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbService } from './provider/breadcrumb.service';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [BreadcrumbService],
  declarations: [BreadcrumbComponent, BreadcrumbItemComponent],
  exports: [ BreadcrumbComponent, RouterModule ]
})
export class BreadcrumbModule { }
