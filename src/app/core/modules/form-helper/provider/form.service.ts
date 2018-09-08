import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, from } from 'rxjs';
import { map, mergeMap, switchMap, buffer, bufferCount } from 'rxjs/operators';
import { IFormResponse } from '../api/response.interface';

@Injectable()
export class FormService<T> {

    public static readonly HOOK_UPDATE: 'update';

    /**
     * currend data which has been loaded
     *
     * @private
     * @type {BehaviorSubject<T>}
     * @memberof FormService
     */
    private app: BehaviorSubject<T>;

    /**
     * available hooks
     *
     * @private
     * @type {Map<string, Observable<IFormResponse>[]>}
     * @memberof FormService
     */
    private hooks: Map<string, Observable<IFormResponse>[]>;

    constructor() {
        this.app   = new BehaviorSubject<T>(null);
        this.hooks = new Map<string, Observable<IFormResponse>[]>();
    }

    /**
     * set model which should edited
     *
     * @param {T} app
     * @memberof FormService
     */
    public editApp(app: T) {
        this.app.next(app);
    }

    /**
     * load model which should be edited
     *
     * @returns {Observable<T>}
     * @memberof FormService
     */
    public loadApp(): Observable<T> {
        return this.app;
    }

    /**
     * call update app, run all hooks for update
     *
     * @returns {Observable<any>}
     * @memberof FormService
     */
    public updateApp(): Observable<any> {

        if ( this.hooks.has(FormService.HOOK_UPDATE) ) {

            const batch = this.hooks.get(FormService.HOOK_UPDATE);
            const source = from(batch);

            return source.pipe(
                switchMap((hook: Observable<IFormResponse>) => {
                    return hook;
                }),
                bufferCount(batch.length)
            );
        }
    }

    /**
     * register hook
     *
     * @param name
     * @param fn
     */
    public registerHook(name: string, obs: Observable<IFormResponse>) {

        if ( ! this.hooks.has(name) ) {
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
    public unRegisterHook(name: string, hook: Observable<IFormResponse>) {

        if ( ! this.hooks.has(name) || this.hooks.get(name).indexOf(hook) === -1) {
            return;
        }

        const hooks = this.hooks.get(name);
        const removeIndex = hooks.indexOf(hook);

        hooks.splice(removeIndex, 1);

        if ( hooks.length === 0 ) {
            this.hooks.delete(name);
        }
    }
}
