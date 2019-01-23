import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EnigmaService } from '@smc/modules/smc-common';
import { ScriptService } from '@smc/modules/ser/provider';
import { Observable, of, from } from 'rxjs';
import { AppRepository } from '@smc/modules/qrs';
import { tap, catchError, mergeMap, map } from 'rxjs/operators';

@Injectable()
export class EditGuard implements CanActivate {

    constructor(
        private appRepository: AppRepository,
        private enigmaService: EnigmaService,
        private scriptService: ScriptService
    ) { }

    /**
     * can active
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<boolean>}
     * @memberof EditGuard
     */
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

        const id = route.params.id;
        return this.appRepository.exists(id).pipe(
            tap(isApp => {
                if (!isApp) {
                    throw new Error('app not exists');
                }
            }),
            mergeMap(() => from(this.enigmaService.getAppScript(id)).pipe(
                map((script: string) => {
                    let valid = true;
                    valid = valid && this.scriptService.hasSerScript(script);
                    valid = valid && this.scriptService.isValid(script);
                    return valid;
                })
            )),
            catchError(() => of(false))
        );
    }
}
