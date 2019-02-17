import { Injectable, Inject } from '@angular/core';
import { AppRepository as QrsAppRepository, FilterFactory, IApp, IQrsFilter, IAppFull, IQrsFilterGroup } from '@smc/modules/qrs';
import { EnigmaService, SmcCache, ISettings } from '@smc/modules/smc-common';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { switchMap, map, tap, mergeMap, concatMap, bufferCount } from 'rxjs/operators';
import { Observable, of, forkJoin, from } from 'rxjs';
import { ScriptService } from './script.service';
import { SER_INITIAL_SCRIPT } from '../model/default-script';

@Injectable()
export class AppRepository {

    private validatedApps: Map<string, boolean>;

    constructor(
        @Inject(SMC_SESSION) private session: ISettings,
        @Inject(SER_INITIAL_SCRIPT) private initialScript: string,
        private cache: SmcCache,
        private enigmaService: EnigmaService,
        private filterFactory: FilterFactory,
        private qrsAppRepository: QrsAppRepository,
        private scriptService: ScriptService
    ) {
        this.validatedApps = new Map();
    }

    /**
     * fetch app by id
     *
     * @param {string} appid
     * @returns {Observable<IApp>}
     * @memberof AppRepository
     */
    public fetchApp(appid: string): Observable<IApp> {

        const qrsFilter = this.filterFactory.createFilter('id', `${appid}`);
        return this.fetchOwnedApps(qrsFilter).pipe(
            switchMap((apps: IApp[]): Observable<IApp[]> => this.filterApps(apps)),
            map((apps: IApp[]) => apps[0])
        );
    }

    /**
     * fetch all apps
     *
     * @returns {Observable<IApp[]>}
     * @memberof AppRepository
     */
    public fetchApps(appFilter?: IQrsFilter): Observable<IApp[]> {

        if (!this.session.serTag) {
            return this.fetchAppsByScript();
        } else {
            const tagFilter = this.filterFactory.createFilter('tags.id', `${this.session.serTag.id}`);
            const _filter = appFilter ? this.filterFactory.createFilterGroup([tagFilter, appFilter]) : tagFilter;
            return this.fetchOwnedApps(_filter)
                .pipe(
                    tap((apps: IApp[]) => {
                        this.cache.set('ser.apps', apps, true);
                    })
                );
        }
    }

    /**
     * ignore SER Tag even it is exists, this will open all apps possible
     * and watch into their script to find SER specific parts.
     *
     * This can take a while.
     *
     * @param {IQrsFilter} [appFilter]
     * @returns {Observable<IApp[]>}
     * @memberof AppRepository
     */
    public fetchAppsByScript(appFilter?: IQrsFilter): Observable<IApp[]> {

        return this.fetchOwnedApps(appFilter).pipe(
            switchMap((apps: IApp[]): Observable<IApp[]> => this.filterApps(apps)),
            tap((apps: IApp[]) => {
                this.cache.set('ser.apps', apps, true);
            })
        );
    }

    /**
     * fetch only untagged apps this will exclude all Apps without SER Tag
     *
     * @returns {Observable<IApp[]>}
     * @memberof AppRepository
     */
    public fetchUntaggedApps(): Observable<IAppFull[]> {

        const app$ = this.fetchOwnedApps();

        if (!this.session.serTag) {
            return app$;
        }

        return app$.pipe(
            map((apps: IAppFull[]) =>
                apps.filter((app: IAppFull) =>
                    app.tags.every(tag => tag.id !== this.session.serTag.id)
                )
            )
        );
    }

    /**
     * create new sense excel reporting app in qlik sense
     * if we have an ser tag, update app into qmc and write ser
     * tag
     *
     * @param {string} name
     * @returns
     * @memberof AppRepository
     */
    public async createApp(name: string): Promise<string> {

        const app = await this.enigmaService.createApp(name);
        await app.setScript(this.initialScript);
        await app.doSave();

        if (this.session.serTag) {
            return this.qrsAppRepository
                .update(app.id, { tags: [this.session.serTag] })
                .pipe(map((qrsApp: IApp) => qrsApp.id))
                .toPromise();
        }
        return app.id;
    }

    /**
     * filter for ser script
     *
     * @private
     * @param {IApp[]} apps
     * @returns {Observable<IApp[]>}
     * @memberof AppRepository
     */
    public filterApps(apps: IApp[]): Observable<IApp[]> {
        return from(apps).pipe(
            concatMap(async (app: IApp): Promise<any> => {
                let isValid = false;
                if (this.validatedApps.has(app.id)) {
                    isValid = this.validatedApps.get(app.id);
                } else {
                    try {
                        const script = await this.enigmaService.getAppScript(app.id);
                        isValid = this.scriptService.hasSerScript(script);
                    } catch (error) {
                        isValid = false;
                    }
                    this.validatedApps.set(app.id, isValid);
                }
                return isValid ? app : null;
            }),
            bufferCount(apps.length),
            map((result: IApp[]) => result.filter(app => !!app))
        );
    }

    /**
     * search for all scripts which has no ser tag
     * and add ser tag if they contain a SER Script
     *
     * @returns {Observable<IApp[]>}
     * @memberof AppRepository
     */
    public addTagToSerApps(): Observable<IApp[]> {

        if (!this.session.serTag) {
            return of([]);
        }

        const tags = [this.session.serTag];
        return this.fetchUntaggedApps().pipe(
            switchMap((apps: IApp[]) => this.filterApps(apps)),
            mergeMap((apps: IApp[]) => {
                if (!apps.length) {
                    return of([]);
                }
                const toUpdate = apps.map((app: IApp) => this.qrsAppRepository.update(app.id, { tags }));
                return forkJoin(...toUpdate);
            })
        );
    }

    private fetchOwnedApps(filter?: IQrsFilter | IQrsFilterGroup) {
        const app$ = forkJoin([
            this.qrsAppRepository.fetchApps(filter),
            this.enigmaService.fetchApps()
        ]).pipe(
            map(([qrsApps, qmcApps]) => {
                return qrsApps.filter((app: IAppFull) => {
                    return qmcApps.some((qmcApp) => qmcApp.qDocId === app.id);
                });
            })
        );
        return app$;
    }
}
