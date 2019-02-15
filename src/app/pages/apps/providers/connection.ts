import { Injectable } from '@angular/core';
import { EnigmaService } from '@smc/modules/smc-common';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class AppConnector {

    private appConnection: BehaviorSubject<EngineAPI.IApp>;
    private app: EngineAPI.IApp;
    private connectionEstablished: boolean;

    constructor(
        private enigmaService: EnigmaService
    ) {
        this.appConnection = new BehaviorSubject(null);
        this.connectionEstablished = false;
    }

    /**
     * return true if a connection to an app exists
     *
     * @returns {boolean}
     * @memberof AppConnector
     */
    public hasConnection(): boolean {
        return this.connectionEstablished;
    }

    /**
     * get current connection
     *
     * @readonly
     * @type {Observable<EngineAPI.IApp>}
     * @memberof Connection
     */
    public get connection(): Observable<EngineAPI.IApp> {
        return this.appConnection.asObservable();
    }

    /**
     * create connection to app
     *
     * @param {string} appId
     * @returns {Promise<EngineAPI.IApp>}
     * @memberof Connection
     */
    public createConnection(appId: string): Observable<EngineAPI.IApp> {
        return from(this.enigmaService.openApp(appId)).pipe(
            tap((app: EngineAPI.IApp) => {
                this.app = app;
                this.connectionEstablished = true;
                this.appConnection.next(app);
            })
        );
    }

    /**
     * close connection to app
     *
     * @memberof Connection
     */
    public async closeConnection(): Promise<void> {

        if (this.app) {
            await this.enigmaService.closeApp(this.app);
        }

        this.connectionEstablished = false;
        this.app = null;
        this.appConnection.next(null);
    }
}
