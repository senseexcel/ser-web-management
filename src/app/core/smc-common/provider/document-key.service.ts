import { Injectable } from '@angular/core';
import { Observable, fromEvent, Subject, ReplaySubject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

export enum KeyCode {
    CTRL = 17,
}

// KeyPressed.onKeyPressed(KeyCodeS.CTRL) -> observable;
@Injectable({ providedIn: 'root' })
export class DocumentKey {

    /**
     * map to save key codes and their observers so we dont need
     * to register them twice and returns on event observer for
     * all who want to know the stateChange on a key
     *
     * @private
     * @type {Map<KeyCode, Observable<any>>}
     * @memberof DocumentKey
     */
    private eventMap: Map<KeyCode, Observable<any>> = new Map();

    /**
     * stateChange
     *
     * @param {KeyCode} keyCode
     * @returns {Observable<any>}
     * @memberof KeyPressed
     */
    public stateChange(keyCode: KeyCode | number): Observable<any> {
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
    private createEventObserver(key: KeyCode | number): Observable<any> {

        const sharedEvent$ = new ReplaySubject<string>(1);
        let subscriberCount = 0;

        this.createKeyEventStream(sharedEvent$, key).subscribe();

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
    private createKeyEventStream(shared$: Subject<any>, key: KeyCode | number): Observable<KeyboardEvent> {
        // this is a subscribe
        const keyDown$ = fromEvent(document, 'keydown');
        const keyUp$ = fromEvent(document, 'keyup');

        let keyIsPressed = false;

        return keyDown$.pipe(
            filter((e: KeyboardEvent) => e.keyCode === key && !keyIsPressed),
            tap(() => {
                keyIsPressed = true;
                shared$.next('pressed');
            }),
            switchMap(() => keyUp$.pipe(
                filter((e: KeyboardEvent) => e.keyCode === key),
                tap(() => {
                    keyIsPressed = false;
                    shared$.next('released');
                })
            ))
        );
    }
}
