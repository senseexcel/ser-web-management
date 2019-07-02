import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

export class OverlayCtrl {

    private uploadCompleted$: Subject<void>;

    constructor(
        private overlayRef: OverlayRef
    ) {
        this.uploadCompleted$ = new Subject();
    }

    public close() {
        this.uploadCompleted$.complete();
        this.overlayRef.dispose();

        this.uploadCompleted$ = null;
        this.overlayRef = null;
    }

    public uploadCompleted() {
        this.uploadCompleted$.next();
    }

    public uploaded(): Observable<void> {
        return this.uploadCompleted$.asObservable();
    }
}
