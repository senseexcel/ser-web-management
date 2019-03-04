import { Injectable } from '@angular/core';
import { EnigmaService } from '@smc/modules/smc-common/provider/enigma.provider';
import { Observable, from, Subject, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppConnector {

    public readonly disconnect: Subject<void> = new Subject();
    public readonly connect: ReplaySubject<EngineAPI.IApp> = new ReplaySubject(1);

    private app: EngineAPI.IApp;
    private connectionEstablished: boolean;

    constructor(
        private enigmaService: EnigmaService
    ) {
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
     * return connection if a connection is established
     *
     * @returns {EngineAPI.IApp}
     * @memberof AppConnector
     */
    public getConnection(): EngineAPI.IApp | null {
        if (this.hasConnection()) {
            return this.app;
        }
        return null;
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
