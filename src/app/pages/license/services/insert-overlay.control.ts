import { ModalControl } from '@smc/modules/modal/services/modal-control';
import { Subject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { IControl } from '@smc/modules/modal/api/control.interface';

export class InsertOverlayControl extends ModalControl implements IControl {

    public update$: Subject<string>;

    private licenseContent: string;

    public constructor(
        overlayRef: OverlayRef,
    ) {
        super(overlayRef);
        this.update$ = new Subject();
    }

    /**
     * update content this will trigger
     *
     * @param {string} content
     * @memberof InsertOverlayControl
     */
    public update() {
        this.update$.next(this.licenseContent);
    }

    /**
     * setter for license content
     *
     * @memberof InsertOverlayControl
     */
    public set content(content: string) {
        this.licenseContent = content;
    }
}
