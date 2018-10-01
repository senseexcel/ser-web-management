import { Injectable, Inject } from '@angular/core';
import { Observable, empty, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigFactory } from '../config/config-factory';
import { map } from 'rxjs/operators';

@Injectable()
export class StartUpService {

    private http: HttpClient;

    private configFactory: ConfigFactory;

    constructor(http: HttpClient, configFactory: ConfigFactory) {
        this.http = http;
        this.configFactory = configFactory;
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
        /// #if mode=="development"
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

        const config: any = this.configFactory.buildSerEngineConfig();

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
            observe: 'response',
            responseType: 'text'
        });
    }
}
