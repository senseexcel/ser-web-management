import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '@breadcrumb/provider/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {

  private breadcrumbService: BreadcrumbService;

  constructor(breadcrumbService: BreadcrumbService ) {
    this.breadcrumbService = breadcrumbService;
  }

  ngOnInit() {
  }
}
