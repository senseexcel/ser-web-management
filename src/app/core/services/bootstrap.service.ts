import { Injectable, Inject } from '@angular/core';
import { IBootstrap } from '@core/api/bootstrap.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, concat } from 'rxjs';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { map } from 'rxjs/operators';
import { AppData } from '@core/model/app-data';
import { ITag } from '@core/api/tag.interface';
import { IDomainUser } from 'ser.api';
import { ISessionUser } from '@core/api/session-user.interface';

@Injectable()
export class BootstrapService implements IBootstrap {

    private http: HttpClient;

    private filterService: SerFilterService;

    private appData: AppData;

    public constructor(
        @Inject('AppData') appData,
        filterService: SerFilterService,
        http: HttpClient
    ) {
        this.appData = appData;
        this.http = http;
        this.filterService = filterService;
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
        const filter = this.filterService.createFilter('name', `'SER'`);

        return this.http.get(url, {
            params: {
                filter: this.filterService.createFilterQueryString(filter)
            }
        }).pipe(
            map((response: ITag[]) => {
                if (!response.length) {
                    return null;
                }
                this.appData.tag = response[0];
            })
        );
    }

    private fetchLoggedInUser(): Observable<any> {

        const url = '/qps/user';

        return this.http.get(url)
        .pipe(
            map( (user: ISessionUser) => {
                this.appData.user = user;
            })
        );
    }
}
