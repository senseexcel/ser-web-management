import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISerEngineConfig } from '@core/modules/ser-engine/api/ser-engine-config.interface';
import { SerAuthenticationService } from '@core/modules/ser-engine/provider/ser-authentication.service';

@Injectable()
export class SerTaskRestService {

    private httpClient: HttpClient;

    private senseConfig: ISerEngineConfig;

    private serAuthService: SerAuthenticationService;

    public constructor(
        @Inject('SerEngineConfig') senseConfig: ISerEngineConfig,
        httpClient: HttpClient,
        serAuthService: SerAuthenticationService
    ) {
        this.httpClient = httpClient;
        this.senseConfig = senseConfig;
        this.serAuthService = serAuthService;
    }

    /**
     * fetch all tasks
     *
     * @memberof SerTaskApiService
     */
    public fetchAllTasks() {
    }

    /**
     * fetch all tasks for an app
     *
     * @param {string} appId
     * @param {*} filter
     * @memberof SerTaskApiService
     */
    public fetchTasksForApp(appId: string, filter?: any) {

        this.serAuthService.token
            .subscribe( (...args) => {
                console.log(args);
            });
        // const endpoint = `hdr/qrs/selection/${appId}/app/full`;
        /*
        const endpoint = `ser/qrs/about`;
        const url      = `https://${this.senseConfig.host}/${endpoint}`;

        return this.httpClient.get(url,
            {
                headers: {
                    'X-Qlik-Xrfkey': '1234567890abcdef',
                    'Authorization': 'desktop-tphgv43\rhannuschka'
                },
                params: {
                    xrfkey: '1234567890abcdef'
                }
            }
        );
        */
    }
}
