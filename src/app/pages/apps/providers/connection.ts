import { Injectable } from '@angular/core';
import { EnigmaService } from '@smc/modules/smc-common';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppConnector {

    private appConnection: BehaviorSubject<EngineAPI.IApp>;
    private app: EngineAPI.IApp;

    constructor(
        private enigmaService: EnigmaService
    ) {
        this.appConnection = new BehaviorSubject(null);
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
                this.appConnection.next(app);
            })
        );
    }

    /**
     * close connection to app
     *
     * @memberof Connection
     */
    public closeConnection(): Observable<void> {
        return from(this.enigmaService.closeApp(this.app)).pipe(
            tap(() => {
                this.app = null;
                this.appConnection.next(this.app);
            })
        );
    }
}
