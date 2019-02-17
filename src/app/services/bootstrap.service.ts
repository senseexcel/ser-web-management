import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISessionUser, ITag } from '@smc/modules/qrs';
import { SMC_SESSION } from '@smc/modules/smc-common/model/session.model';
import { ISettings, IDataNode, SmcCache } from '@smc/modules/smc-common';
import { FilterFactory } from '@smc/modules/qrs/provider/filter.factory';
import { IBootstrap } from '../api/bootstrap.interface';
import { SMC_SETTINGS } from '../settings/smc-settings.model';

@Injectable()
export class BootstrapService implements IBootstrap {

    private http: HttpClient;

    public constructor(
        @Inject(SMC_SESSION) private session: ISettings,
        @Inject(SMC_SETTINGS) private settings: IDataNode,
        private smcCache: SmcCache,
        private filterFactory: FilterFactory,
        http: HttpClient
    ) {
        this.http = http;
    }

    public bootstrap(): Promise<any> {

        this.smcCache.set('smc.settings', this.settings);

        return forkJoin(
            this.fetchTag(),
            this.fetchLoggedInUser(),
        )
        .toPromise();
    }

    /**
     * fetch tag
     *
     * @private
     * @returns {Observable<void>}
     * @memberof BootstrapService
     */
    private fetchTag(): Observable<void> {
        const url = '/qrs/tag/full';
        const filter = this.filterFactory.createFilter('name', `'SER'`);

        return this.http.get(url, {
            params: {
                filter: this.filterFactory.createFilterQueryString(filter)
            }
        }).pipe(
            map((response: ITag[]) => {
                if (response.length) {
                    this.session.serTag = response[0];
                }
            })
        );
    }

    private fetchLoggedInUser(): Observable<void> {

        const url = '/qps/user';

        return this.http.get(url)
        .pipe(
            map( (user: ISessionUser) => {
                this.session.loggedInUser = user;
            })
        );
    }

    private readSmcSettings(): void {
    }
}
