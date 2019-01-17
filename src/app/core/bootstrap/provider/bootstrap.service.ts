import { Injectable, Inject } from '@angular/core';
import { IBootstrap } from '@smc/modules/bootstrap/api/bootstrap.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISessionUser, ITag } from '@smc/modules/qrs';
import { SMC_SETTINGS } from '@smc/modules/common/model/settings.model';
import { ISettings } from '@smc/modules/common';
import { FilterFactory } from '@smc/modules/qrs/provider/filter.factory';

@Injectable()
export class BootstrapService implements IBootstrap {

    private http: HttpClient;

    public constructor(
        @Inject(SMC_SETTINGS) private settings: ISettings,
        private filterFactory: FilterFactory,
        http: HttpClient
    ) {
        this.http = http;
    }

    public bootstrap(): Promise<any> {
        return forkJoin(
            this.fetchTag(),
            this.fetchLoggedInUser()
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
    private fetchTag(): Observable<any> {
        const url = '/qrs/tag/full';
        const filter = this.filterFactory.createFilter('name', `'SER'`);

        return this.http.get(url, {
            params: {
                filter: this.filterFactory.createFilterQueryString(filter)
            }
        }).pipe(
            map((response: ITag[]) => {
                if (!response.length) {
                    return null;
                }
                this.settings.serTag = response[0];
            })
        );
    }

    private fetchLoggedInUser(): Observable<any> {

        const url = '/qps/user';

        return this.http.get(url)
        .pipe(
            map( (user: ISessionUser) => {
                this.settings.loggedInUser = user;
            })
        );
    }
}
