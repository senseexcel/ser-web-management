import { Injectable } from '@angular/core';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import { AppCreatedResponse } from '../api';

@Injectable()
export class EnigmaService {

    private sessions: Map<string, EngineAPI.IApp>;

    constructor() {
        this.sessions = new Map();
    }

    /**
     * create a new app on qlik and returns websocket connection to created app
     *
     * @param {string} appName
     * @returns {Promise<EngineAPI.IApp>}
     * @memberof SessionService
     */
    public async createApp(appName: string): Promise<EngineAPI.IApp> {
        const global = await this.openSession() as any; /** cast as any since type is not valid */
        const newApp = await global.createApp(appName, 'main') as AppCreatedResponse;
        const session = global.openDoc(newApp.qAppId);
        this.sessions.set(newApp.qAppId, session);
        return session;
    }

    /**
     * open a new websocket connection to qlik app
     *
     * @param {string} appId
     * @returns {Promise<EngineAPI.IApp>}
     * @memberof SessionService
     */
    public async openApp(appId: string): Promise<EngineAPI.IApp> {
        if (!this.sessions.has(appId) ) {
            const global  = await this.openSession() as any; /** cast as any since type is not valid */
            const session = await global.openDoc(appId, '', '', '', true);
            this.sessions.set(appId, session);
        }
        return this.sessions.get(appId);
    }

    /**
     * close a session
     *
     * @param {EngineAPI.IApp} app
     * @returns {Promise<boolean>}
     * @memberof SessionService
     */
    public async closeApp(app: EngineAPI.IApp): Promise<boolean> {
        const appId = app.id;
        await app.session.close();
        return this.sessions.delete(appId);
    }

    /**
     * load script from qlik app
     *
     * @param {string} appId
     * @returns {Promise<string>}
     * @memberof SessionService
     */
    public async getAppScript(appId: string): Promise<string> {
        const app    = await this.openApp(appId);
        const script = await app.getScript();
        await this.closeApp(app);
        return script;
    }

    public async saveScript(appId: string, script: string): Promise<void> {
        const app = await this.openApp(appId);
        await app.setScript(script);
        await app.doSave();
        await this.closeApp(app);
    }

    /**
     * create new session for app
     *
     * @private
     * @param {string} [appId='engineData']
     * @returns {Promise<enigmaJS.ISession>}
     * @memberof SerAppService
     */
    private createSession(appId = 'engineData'): Promise<enigmaJS.ISession> {

        return new Promise<enigmaJS.ISession>((resolve) => {
            const url = buildUrl({
                host: window.location.host,
                secure: true,
                appId,
                identity: Math.random().toString(32).substr(2)
            });

            const session: enigmaJS.ISession = create({
                schema: qixSchema,
                url
             });

            resolve(session);
        });
    }

    private async openSession(): Promise<enigmaJS.IGeneratedAPI> {
        const session = await this.createSession();
        return session.open();
    }
}
