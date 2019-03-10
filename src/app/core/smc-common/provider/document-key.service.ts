import { Injectable, NgZone } from '@angular/core';
import { Observable, fromEvent, ReplaySubject } from 'rxjs';
import { filter, merge, distinctUntilChanged } from 'rxjs/operators';

// KeyPressed.onKeyPressed(KeyCodeS.CTRL) -> observable;
@Injectable({ providedIn: 'root' })
export class DocumentKeyEvent {

    private keyDown$: Observable<KeyboardEvent>;

    private keyUp$: Observable<KeyboardEvent>;

    constructor(
        private zone: NgZone
    ) { }

    /**
     * map to save key codes and their observers so we dont need
     * to register them twice and returns on event observer for
     * all who want to know the stateChange on a key
     *
     * @private
     * @type {Map<KeyCode, Observable<any>>}
     * @memberof DocumentKey
     */
    private eventMap: Map<number, Observable<any>> = new Map();

    /**
     * stateChange
     *
     * @param {KeyCode} keyCode
     * @returns {Observable<any>}
     * @memberof KeyPressed
     */
    public stateChange(keyCode: number): Observable<any> {
        if (!this.eventMap.has(keyCode)) {
            this.eventMap.set(keyCode, this.createEventObserver(keyCode));
        }
        return this.eventMap.get(keyCode);
    }

    /**
     * create shared event stream and register to this
     * we we get notified if key state has been changed
     *
     * @private
     * @param {KeyCode} key
     * @returns {Observable<any>}
     * @memberof KeyPressed
     */
    private createEventObserver(key: number): Observable<any> {

        const sharedEvent$ = new ReplaySubject<string>(1);
        let subscriberCount = 0;

        /**
         * run outside of angular zone so angular change detection
         * will not handled on keypresed events
         */
        this.zone.runOutsideAngular(() => {
            this.createKeyEventStream(key).subscribe((event: KeyboardEvent) => {
                sharedEvent$.next(event.type === 'keyup' ? 'released' : 'pressed');
            });
        });

        return Observable.create(observer => {

            const event$ = sharedEvent$.subscribe(observer);
            subscriberCount++;

            // unsubscribe
            return () => {
                event$.unsubscribe();
                subscriberCount--;
                if (subscriberCount <= 0) {
                    sharedEvent$.complete();
                    this.eventMap.delete(key);
                }
            };
        });
    }

    /**
     * create key event streams, keyup and keydown on document
     *
     * @private
     * @param {Subject<any>} shared$
     * @param {KeyCode} key
     * @returns {Observable<KeyboardEvent>}
     * @memberof DocumentKey
     */
    private createKeyEventStream(key: number): Observable<KeyboardEvent> {

        /** ensures we only have one keydown and one keyup event */
        const keyDown$ = this.keyDown$ || (this.keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown'));
        const keyUp$ = this.keyUp$ || (this.keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup'));

        return keyDown$.pipe(
            merge(keyUp$),
            filter((e: KeyboardEvent) => e.keyCode === key),
            distinctUntilChanged((x, y) => x.type === y.type)
        );
    }
}
