import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { EnigmaService } from '@smc/modules/smc-common';
import { ScriptService, ReportService } from '@smc/modules/ser/provider';
import { Observable, of, from } from 'rxjs';
import { AppRepository } from '@smc/modules/qrs';
import { tap, catchError, mergeMap, map } from 'rxjs/operators';
import { CacheService } from '../providers/cache.service';

@Injectable()
export class EditGuard implements CanActivate {

    constructor(
        private appRepository: AppRepository,
        private enigmaService: EnigmaService,
        private scriptService: ScriptService,
        private reportService: ReportService,
        private cacheService: CacheService
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
        console.log('ich werd aufgerufen ????');

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
                    const reportData   = this.scriptService.extractReports(parsedScript);
                    const report       = this.reportService.createReport(reportData[0]);

                    this.cacheService.currentReportData = {
                        app: id,
                        script: parsedScript,
                        report,
                        raw: this.reportService.cleanReport(report.raw)
                    };
                    return true;
                })
            )),
            catchError((e) => of(false))
        );
    }
}
