import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, config, Observable } from 'rxjs';
import { sign } from 'jsonwebtoken';
import { ISerEngineConfig } from '../api/ser-engine-config.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { switchMap, map, shareReplay } from 'rxjs/operators';

@Injectable()
export class SerAuthenticationService {

    private tokenBearer$: BehaviorSubject<string>;

    private tokenBearer: string;

    private serEngineConfig: ISerEngineConfig;

    private httpClient: HttpClient;

    constructor(
        @Inject('SerEngineConfig') serEngineConfig: ISerEngineConfig,
        httpClient: HttpClient
    ) {
        this.httpClient      = httpClient;
        this.serEngineConfig = serEngineConfig;
        this.tokenBearer$    = new BehaviorSubject<string>(null);
    }

    /**
     * think about this
     */
    public get token(): BehaviorSubject<string> {

        if ( ! this.tokenBearer ) {
            this.fetchToken().pipe(
                map(() => {
                    this.tokenBearer = 'true';
                })
            ).subscribe ( () => {});
        }

        this.httpClient.get('https://desktop-tphgv43/ser/qrs/about', {
            headers: {
                'x-Qlik-Xrfkey': '1234567890abcdef'
            }
            withCredentials: true,
            params: {
                xrfkey: '1234567890abcdef'
            }
        })
        .subscribe( (response) => {
            console.log(response);
        });

        return this.tokenBearer$;
    }

    private fetchToken(): Observable<string> {

        const endpoint     = this.serEngineConfig.jwt.endpoint;
        const host         = this.serEngineConfig.host;
        const token        = this.buildJwtToken();
        const virtualProxy = this.serEngineConfig.virtualProxy;

        const url = `https://${host}/${virtualProxy}/${endpoint}`;

        // submit request
        return this.httpClient.get(url, {
            headers: {
                'Content-Type': 'text/html',
                'Authorization': `Bearer ${token}`
            },
            responseType: 'text',
            observe: 'response',
            withCredentials: true
        })
        .pipe(
            map( (response: any) => {
                // return response.json;
                return response;
            })
        );
    }

    /**
     *
     *
     * @private
     * @memberof SerAuthenticationService
     */
    private buildJwtToken(): string {
        const payLoad = {
            UserDirectory: this.serEngineConfig.userDirectory,
            UserId: this.serEngineConfig.userId
        };

        try {
            return sign(payLoad, 'jena', { algorithm: 'RS256' });
        } catch (error) {
            console.log(error);
            return 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiJyaGFubnVzY2hrYSIsIlVzZXJEaXJlY3RvcnkiOiJkZXNrdG9wLXRwaGd2NDMifQ.jvjBvNA2I0hAJlpFguoqP_NZYfhz14iSSyXtqyrA3Z4rx9BDvHYSqABz32FfikPMiJN809_lz4koVq7qyPHPWm4RLwIZRgTeOkKbpZodWowrH5zN2X5MSDNz5iqF_bU3oSecwsrchh-NWxWE30gwv8Aph4dD3a-vorCK7d7IY-9mTb9PJVVf-Iax949du-TQ_r0Mw4q-t9z_NDQW_Feq0oOEtu4xwqR7Ll6nUopbDcv1PZxDhut6tnJUjp_OIGMoPms8i3invt8hhUhYZ_tvav7kfGweiy3aqy2m1O0FfSDNz5gZNXqt7vJ1UCUNUYVXdXNy6Ez1cUfVx6hqkXScsw';
        }
    }
}
