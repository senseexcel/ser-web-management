import { Injectable, Inject } from '@angular/core';
import { AppRepository as QrsAppRepository, FilterFactory, IApp } from '@smc/modules/qrs';
import { EnigmaService, SmcCache, ISettings } from '@smc/modules/smc-common';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { switchMap, map, tap, mergeMap, concatMap, filter, combineAll, bufferCount } from 'rxjs/operators';
import { Observable, of, forkJoin, from } from 'rxjs';
import { ScriptService } from './script.service';
import { SER_INITIAL_SCRIPT } from '../model/default-script';

@Injectable()
export class AppRepository {

    constructor(
        @Inject(SMC_SESSION) private session: ISettings,
        @Inject(SER_INITIAL_SCRIPT) private initialScript: string,
        private cache: SmcCache,
        private enigmaService: EnigmaService,
        private filterFactory: FilterFactory,
        private qrsAppRepository: QrsAppRepository,
        private scriptService: ScriptService
    ) {}

    /**
     * fetch all apps
     *
     * @returns {Observable<IApp[]>}
     * @memberof AppRepository
     */
    public fetchApps(): Observable<IApp[]> {

        let app$;
        if (!this.session.serTag) {
            app$ = this.qrsAppRepository.fetchApps().pipe(
                switchMap((apps: IApp[]): Observable<IApp[]> => this.filterApps(apps)));
        } else {
            const tagFilter = this.filterFactory.createFilter('tags.id', `${this.session.serTag.id}`);
            app$ = this.qrsAppRepository.fetchApps(tagFilter);
        }

        app$ = app$.pipe(
            tap((apps: IApp[]) => {
                this.cache.set('ser.apps', apps, true);
            })
        );

        return app$;
    }

    /**
     * fetch only untagged apps this will exclude all Apps without SER Tag
     *
     * @returns {Observable<IApp[]>}
     * @memberof AppRepository
     */
    public fetchUntaggedApps(): Observable<IApp[]> {

        if (!this.session.serTag) {
            return this.qrsAppRepository.fetchApps();
        }

        return this.qrsAppRepository.fetchApps()
            .pipe(
                map((apps: IApp[]) =>
                    apps.filter((app: IApp) =>
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
            concatMap(async (app: IApp): Promise<IApp | null> => {
                try {
                    const script = await this.enigmaService.getAppScript(app.id);
                    return this.scriptService.hasSerScript(script) ? app : null;
                } catch (error) {
                    return null;
                }
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
}
