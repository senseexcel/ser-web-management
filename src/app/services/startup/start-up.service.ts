import { Injectable } from '@angular/core';
import { Observable, empty, forkJoin } from 'rxjs';

/// #if DEV
import * as SerEngineDevConfig from '../../config/ser-engine.config.dev.json';
import { HttpClient } from '@angular/common/http';
/// #endif

@Injectable()
export class StartUpService {

    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     * created requests or any async operations which should be done before
     * the app starts
     *
     * @returns {Promise<void>}
     * @memberof StartUpService
     */
    public load(): Promise<void> {
        const requests: Observable<any>[] = [];
        /// #if DEV
        requests.push(this.createSessionCookie());
        /// #endif

        return forkJoin(...requests)
            .toPromise();
    }

    /**
     * create session cookie only needed if we develop not in qmc
     *
     * @private
     * @returns {Observable<any>}
     * @memberof StartUpService
     */
    private createSessionCookie(): Observable<any> {

        const config: any = SerEngineDevConfig;

        const endpoint     = config.jwt.endpoint;
        const token        = config.jwt.token;
        const host         = config.host;
        const virtualProxy = config.virtualProxy;

        const url = `https://${host}/${virtualProxy}${endpoint}`;

        return this.http.get(url, {
            headers: {
                'Content-Type': 'text/html',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
            responseType: 'text'
        });
    }
}
