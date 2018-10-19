import { Component, OnInit, Inject } from '@angular/core';
import { AppData } from '@core/model/app-data';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IModalData } from '@core/modules/modal/api/modal-config.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private appData: AppData;

  private modalService: ModalService;

  public constructor(
    @Inject('AppData') appData,
    modalService: ModalService
  ) {
    this.appData = appData;
    this.modalService = modalService;
  }

  public ngOnInit() {

    if (!this.appData.tag) {
      this.displayModal();
    }
  }

  private displayModal() {

    const modalData: IModalData = {
      title: 'Slow Motion',
      content: DashboardComponent,
    };

    this.modalService.open(modalData);
  }
}
