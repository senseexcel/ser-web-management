import { Observable, defer } from 'rxjs';

export function updateHook<T>(hook: (value: T) => void) {
    // this function is called ...
    return function inner(source: Observable<T>, ...rest): Observable<T> {
        return Observable.create((observer) => {

            return source.subscribe({
                next: (value) => {
                    hook(value);
                    observer.next(value);
                }
            });
        });
    };
}
