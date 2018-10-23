import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { AppData } from '@core/model/app-data';
import { ModalService } from '@core/modules/modal/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  private appData: AppData;

  private modalService: ModalService;

  public constructor(
    @Inject('AppData') appData,
    modalService: ModalService
  ) {
    this.appData = appData;
    this.modalService = modalService;

    if (!this.appData.tag) {
      this.displayModal();
    }
  }

  private displayModal() {

    this.modalService.openMessageModal(
      'SER Tag not found',
      `SER Tag wurde nicht gefunden was die Ladezeiten stark erhöhen kann.
       Bitte kontaktieren sie ihren Akquinet Qlik Berater oder Administrator.`
      );
  }
}
