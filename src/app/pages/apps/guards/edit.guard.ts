import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EnigmaService, SmcCache } from '@smc/modules/smc-common';
import { ScriptService, ReportService } from '@smc/modules/ser/provider';
import { Observable, of, from } from 'rxjs';
import { AppRepository } from '@smc/modules/qrs';
import { tap, catchError, mergeMap, map } from 'rxjs/operators';

@Injectable()
export class EditGuard implements CanActivate {

    constructor(
        private appRepository: AppRepository,
        private enigmaService: EnigmaService,
        private scriptService: ScriptService,
        private reportService: ReportService,
        private smcCache: SmcCache
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

                    const parsedScript = this.scriptService.parse(script);
                    const reportData = this.scriptService.extractReports(parsedScript);
                    const report = this.reportService.createReport(reportData[0]);
                    valid = valid && report.isValid;

                    if (valid && report.isValid) {
                        this.smcCache.set('smc.pages.report.edit.current', {
                            app: id,
                            script: parsedScript,
                            report: {
                                model: report,
                                raw: {}
                            }
                        });
                    }
                    return valid;
                })
            )),
            catchError(() => of(false))
        );
    }
}
