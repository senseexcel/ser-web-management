import { Component, OnInit, Inject } from '@angular/core';
import { AppData } from '@core/model/app-data';
import { ModalService } from '@core/modules/modal/services/modal.service';
import { StorageService, SerStorageKey } from '@core/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private appData: AppData;

  private modalService: ModalService;

  private storage: StorageService;

  public constructor(
    @Inject('AppData') appData,
    storage: StorageService,
    modalService: ModalService
  ) {
    this.appData = appData;
    this.modalService = modalService;
    this.storage = storage;

    const showModal = this.storage.read(SerStorageKey.MODAL_SER_TAG_MISSING);

    if (!this.appData.tag && (typeof showModal !== 'boolean' || showModal)) {
      this.displayModal();
    }
  }

  public ngOnInit() {
  }

  /**
   * display modal
   *
   * @private
   * @memberof AppComponent
   */
  private displayModal() {

    const title   = 'SER Tag not found';
    const message = `SER Tag for Apps was not found, this will increase loading times for app and task lists.\n\n
       To add a SER Tag please contact your Administrator or Akquinet Qlik Consultant.`;

    const modalControl = this.modalService.openMessageModal(title, message, {}, true);
    modalControl.onClose.subscribe(() => {
      if (modalControl.showAgain) {
        this.storage.write(SerStorageKey.MODAL_SER_TAG_MISSING, false);
      }
    });
  }
}
