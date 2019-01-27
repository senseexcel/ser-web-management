import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, from } from 'rxjs';
import { reduce, tap, combineAll, switchMap, bufferCount, catchError } from 'rxjs/operators';

@Injectable()
export class FormService<T, R> {

    public static readonly HOOK_UPDATE: 'update';

    /**
     * currend data which has been loaded
     *
     * @private
     * @type {BehaviorSubject<T>}
     * @memberof FormService
     */
    private model: BehaviorSubject<T>;

    /**
     * available hooks
     *
     * @private
     * @type {Map<string, Observable<R>[]}
     * @memberof FormService
     */
    private hooks: Map<string, Observable<R>[]>;

    constructor() {
        this.model = new BehaviorSubject<T>(null);
        this.hooks = new Map<string, Observable<R>[]>();
    }

    /**
     * set model which should edited
     *
     * @param {T} app
     * @memberof FormService
     */
    public loadModel(model: T) {
        this.model.next(model);
    }

    /**
     * load model which should be edited
     * @todo rename to editModel or simple edit
     *
     * @returns {Observable<T>}
     * @memberof FormService
     */
    public editModel(): Observable<T> {
        return this.model;
    }

    /**
     * call update form model, this runs all update
     * hooks which are defined and return combined result
     * of all registered update hooks
     *
     * @returns {Observable<any>}
     * @memberof FormService
     */
    public updateModel(): Observable<R[]> {
        if (this.hooks.has(FormService.HOOK_UPDATE)) {
            const batch: Observable<R>[] = this.hooks.get(FormService.HOOK_UPDATE);
            return from(batch).pipe(
                switchMap((hook: Observable<R>) => hook),
                bufferCount(batch.length),
            );
        }
        return of([]);
    }

    /**
     * register hook
     *
     * @param name
     * @param fn
     */
    public registerHook(name: string, obs: Observable<R>) {
        if (!this.hooks.has(name)) {
            this.hooks.set(name, [obs]);
            return;
        }
        this.hooks.get(name).push(obs);
    }

    /**
     * unregister hook
     *
     * @param {string} name
     * @param {() => Observable<any>} fn
     * @returns
     * @memberof FormService
     */
    public unRegisterHook(name: string, hook: Observable<R>) {
        if (!this.hooks.has(name) || this.hooks.get(name).indexOf(hook) === -1) {
            return;
        }
        const hooks = this.hooks.get(name);
        const removeIndex = hooks.indexOf(hook);
        hooks.splice(removeIndex, 1);
        if (hooks.length === 0) {
            this.hooks.delete(name);
        }
    }
}
