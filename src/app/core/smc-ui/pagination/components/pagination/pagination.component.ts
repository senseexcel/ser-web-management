import { Component, Input, Inject, OnInit } from '@angular/core';
import { PaginationService } from '../../providers/pagination.service';

@Component({
  selector: 'smc-pagination',
  templateUrl: 'pagination.component.html',
  providers: [ PaginationService ],
  viewProviders: [ PaginationService ]
})

export class PaginationComponent implements OnInit {

  @Input()
  public type: 'page';

  constructor() { }

  ngOnInit() {
  }
}
