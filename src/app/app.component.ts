import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ModalService } from '@smc/modules/modal';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings } from '@smc/modules/smc-common';
import { StorageService, SerStorageKey } from '@smc/modules/smc-common/provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  private modalService: ModalService;

  private storage: StorageService;

  public constructor(
    @Inject(SMC_SESSION) private settings: ISettings,
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

    const title   = 'SMC_CORE.DIALOG.SER_TAG_MISSING_TITLE';
    const message = {key: 'SMC_CORE.DIALOG.SER_TAG_MISSING_MESSAGE'};

    const modalControl = this.modalService.openMessageModal(title, message, {}, true);
    modalControl.onClose.subscribe(() => {
      if (modalControl.showAgain) {
        this.storage.write(SerStorageKey.MODAL_SER_TAG_MISSING, false);
      }
    });
  }
}
