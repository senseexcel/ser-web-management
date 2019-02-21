import { Injectable } from '@angular/core';
import * as qixSchema from '@node_modules/enigma.js/schemas/12.20.0.json';
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import { AppCreatedResponse } from '../api';

@Injectable()
export class EnigmaService {

    private sessions: Map<string, EngineAPI.IApp>;
    private appCache: EngineAPI.IDocListEntry[];

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

    public async createSessionApp(): Promise<EngineAPI.IApp> {
        const global = await this.openSession();
        const sessionApp =  await global.createSessionApp();
        console.dir(sessionApp);
        this.sessions.set(sessionApp.id, sessionApp);
        return sessionApp;
    }

    /**
     * open a new websocket connection to qlik app
     *
     * @param {string} appId
     * @returns {Promise<EngineAPI.IApp>}
     * @memberof SessionService
     */
    public async openApp(appId: string): Promise<EngineAPI.IApp> {

        if (this.sessions.has(appId)) {
            return this.sessions.get(appId);
        }

        let global: EngineAPI.IGlobal;
        try {
            global = await this.openSession(); /** cast as any since type is not valid */
            const session = await global.openDoc(appId, '', '', '', false);
            this.sessions.set(appId, session);
            return session;
        } catch (error) {
            global.session.close();
            throw error;
        }
    }

    /**
     * close a session
     *
     * @param {EngineAPI.IApp} app
     * @returns {Promise<boolean>}
     * @memberof SessionService
     */
    public async closeApp(app: EngineAPI.IApp): Promise<void> {
        const appId = app.id;
        await app.session.close();
        this.sessions.delete(appId);
    }

    /**
     * load script from qlik app
     *
     * @param {string} appId
     * @returns {Promise<string>}
     * @memberof SessionService
     */
    public async getAppScript(appId: string): Promise<string> {
        const app = await this.openApp(appId);
        const script = await app.getScript();
        await this.closeApp(app);
        return script;
    }

    /**
     * write script to app
     *
     * @param {string} script
     * @param {string} appid
     * @returns {Promise<void>}
     * @memberof AppRepository
     */
    public async writeScript(script: string, appid: string): Promise<void> {
        // could we wrap this into Observable ...
        const app = await this.openApp(appid);
        await app.setScript(script);
        this.closeApp(app);
    }

    /**
     * fetch all apps we have access to in qlik sense
     *
     * @memberof EnigmaService
     */
    public async fetchApps(force = false): Promise<EngineAPI.IDocListEntry[]> {

        if (!this.appCache || force) {
            const global = await this.openSession();
            /** typings are wrong, we got an array of doclist entries and not 1 doclist entry */
            const appList = await global.getDocList() as any;
            await global.session.close();
            this.appCache = appList as EngineAPI.IDocListEntry[];
        }

        return this.appCache;
    }

    public async reloadApps(): Promise<void> {
        await this.fetchApps(true);
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

    private async openSession(): Promise<EngineAPI.IGlobal> {
        const session = await this.createSession();
        return session.open();
    }
}
