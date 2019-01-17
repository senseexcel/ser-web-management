import { Component, Inject } from '@angular/core';
import { ModalService } from '@smc/modules/modal';
import { SMC_SETTINGS } from '@smc/modules/common/model/settings.model';
import { ISettings } from '@smc/modules/common';
import { StorageService, SerStorageKey } from '@smc/modules/common/provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private modalService: ModalService;

  private storage: StorageService;

  public constructor(
    @Inject(SMC_SETTINGS) private settings: ISettings,
    storage: StorageService,
    modalService: ModalService
  ) {
    this.modalService = modalService;
    this.storage = storage;

    const showModal = this.storage.read(SerStorageKey.MODAL_SER_TAG_MISSING);

    if (!this.settings.serTag && (typeof showModal !== 'boolean' || showModal)) {
      this.displayModal();
    }
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
