import { Injectable, Inject } from '@angular/core';
import { AppRepository as QrsAppRepository, FilterFactory, IApp } from '@smc/modules/qrs';
import { EnigmaService, SmcCache, ISettings } from '@smc/modules/common';
import { SMC_SETTINGS } from '@smc/modules/common/model/settings.model';
import { switchMap, concatMap, catchError, filter, map, combineAll, tap } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { ScriptService } from './script.service';

@Injectable()
export class AppRepository {

    constructor(
        @Inject(SMC_SETTINGS) private settings: ISettings,
        private cache: SmcCache,
        private enigmaService: EnigmaService,
        private filterFactory: FilterFactory,
        private qrsAppRepository: QrsAppRepository,
        private scriptService: ScriptService
    ) {
    }

    public fetchApps(): Observable<IApp[]> {
        let app$;
        if (!this.settings.serTag) {
            app$ = this.qrsAppRepository.fetchApps()
                .pipe(
                    switchMap((apps: IApp[]): Observable<IApp[]> => this.fetchSerApps(apps))
                );
        } else {
            const tagFilter = this.filterFactory.createFilter('tags.id', `${this.settings.serTag.id}`);
            app$ = this.qrsAppRepository.fetchApps(tagFilter);
        }

        app$ = app$.pipe(
            tap((apps: IApp[]) => {
                this.cache.set('ser.apps', apps);
            })
        );

        return app$;
    }

    private fetchSerApps(apps: IApp[]): Observable<IApp[]> {
        return from(apps).pipe(
            concatMap(async (app: IApp): Promise<IApp> => {
                const script = await this.enigmaService.getAppScript(app.id);
                if (this.scriptService.hasSerScript(script)) {
                    return app;
                }
                return null;
            }),
            catchError(() => of(null)),
            filter((app: IApp) => !!app),
            map((app) => of(app)), // map to observable since concatmap is async and returns promise
            combineAll(),
        );
    }
}
