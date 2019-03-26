import { Injectable, Optional } from '@angular/core';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { buildUrl } from 'enigma.js/sense-utilities';
import { create } from 'enigma.js';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class QlikSessionService {

    /**
     * create qlik session
     *
     * @returns {enigmaJS.ISession}
     * @memberof QlikSessionService
     */
    public createSession(): enigmaJS.ISession {
        /** build url */
        const url = buildUrl({
            host: window.location.host,
            secure: true,
            identity: Math.random().toString(32).substr(2)
        });

        /** create config for session */
        const config = {
            schema: qixSchema,
            url
        };

        /** create qlik session */
        return create(config);
    }

    /**
     * creat qlik sessionApp
     *
     * @memberof QlikSessionService
     */
    public createSessionApp(session: enigmaJS.ISession = null): Observable<EngineAPI.IApp> {

        let qSession: enigmaJS.ISession = session;

        if (!qSession) {
            qSession = this.createSession();
        }

        return from(qSession.open()).pipe(
            switchMap((connection: EngineAPI.IGlobal) => connection.createSessionApp())
        );
    }
}
