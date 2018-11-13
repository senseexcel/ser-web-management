import { ModalControl } from '@core/modules/modal/services/modal-control';
import { BehaviorSubject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';

export class InsertOverlayControl extends ModalControl {

    public update$: BehaviorSubject<string>;

    private licenseContent: string;

    public constructor(ref: OverlayRef) {
        super(ref);
        this.update$ = new BehaviorSubject('');
    }

    /**
     * update content this will trigger
     *
     * @param {string} content
     * @memberof InsertOverlayControl
     */
    public update(content: string) {
        if (content !== this.licenseContent) {
            this.update$.next(content);
        }
        this.content = content;
    }

    /**
     * setter for license content
     *
     * @memberof InsertOverlayControl
     */
    public set content(content: string) {
        this.licenseContent = content;
    }

    /**
     * getter for license content
     *
     * @type {string}
     * @memberof InsertOverlayControl
     */
    public get content(): string {
        return this.licenseContent;
    }
}
