import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppData } from '@core/model/app-data';
import { ModalService } from '@core/modules/modal/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private appData: AppData;

  private modalService: ModalService;

  private locationService: Location;

  public constructor(
    @Inject('AppData') appData,
    location: Location,
    modalService: ModalService
  ) {
    this.appData = appData;
    this.modalService = modalService;
    this.locationService = location;

    if (!this.appData.tag) {
      this.displayModal();
    }
  }

  public ngOnInit() {
  }

  private displayModal() {
    this.modalService.openMessageModal(
      'SER Tag not found',
      `SER Tag for Apps was not found, this will increase loading times for app and task lists.\n\n
       To add a SER Tag please contact your Administrator or Akquinet Qlik Consultant.`
      );
  }
}
