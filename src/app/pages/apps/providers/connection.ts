import { Injectable } from '@angular/core';
import { EnigmaService } from '@smc/modules/smc-common';
import { Observable, from, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppConnector {

    public readonly disconnect: Subject<void>        = new Subject();
    public readonly connect: Subject<EngineAPI.IApp> = new Subject();

    private appConnection: Subject<EngineAPI.IApp>;
    private app: EngineAPI.IApp;
    private connectionEstablished: boolean;

    constructor(
        private enigmaService: EnigmaService
    ) {
        this.appConnection = new Subject();
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
                this.connect.next(app);
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
            this.disconnect.next();
        }

        this.connectionEstablished = false;
        this.app = null;
    }
}
