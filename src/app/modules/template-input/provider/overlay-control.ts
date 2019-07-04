import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

export class OverlayCtrl {

    private select$: Subject<string>;

    constructor(
        private overlayRef: OverlayRef,
    ) {
        this.select$ = new Subject();
    }

    public close() {
        this.overlayRef.dispose();
        this.select$.complete();
        this.select$ = null;
    }

    public select(value: string) {
        this.select$.next(value);
    }

    public onSelect(): Observable<string> {
        return this.select$.asObservable();
    }
}
