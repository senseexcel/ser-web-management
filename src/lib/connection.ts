//#region imports
import * as enigma                  from "enigma.js";
import * as bluebird                from "bluebird";
import { exposeAppApi }             from "../mixins/addDoc";

const qixSchema = require("../node_modules/enigma.js/schemas/12.20.0.json");
//#endregion

export class Connection {

    //#region variables
    private configEnigma: enigmaJS.IConfig;
    private qlikGlobal: EngineAPI.IGlobal;
    private session: enigmaJS.ISession;
    private isSecure: boolean;
    private host: string;
    private port: string;
    private prefixString: string;
    //#endregion

    constructor() {
        console.log("Constructor called: Connection");

        const prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
        this.prefixString = prefix!=="/"?`/${prefix}/`:"/";
        this.host = window.location.hostname;
        this.port = window.location.port?`:${window.location.port}`:"";
        this.isSecure = window.location.protocol === "https:";
    }

    /**
     * createSession
     */
    public createSession(): Promise<enigmaJS.ISession> {
        console.log("fcn called: createSession - Connection");

        return new Promise((resolve, reject) => {
            try {
                const baseUrl =`${this.isSecure?"wss": "ws"}://${this.host}${this.port}${this.prefixString}app/engineData`;

                this.configEnigma = {
                    Promise: bluebird,
                    schema: qixSchema,
                    mixins: [exposeAppApi],
                    url: baseUrl
                };

                let session: enigmaJS.ISession = enigma.create(this.configEnigma);
                resolve(session);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * createSession
     */
    public createUniqSession(appId: string): Promise<enigmaJS.ISession> {
        console.log("fcn called: createSession - Connection");

        return new Promise((resolve, reject) => {
            try {
                const baseUrl =`${this.isSecure?"wss": "ws"}://${this.host}${this.port}${this.prefixString}app/${appId}`;

                let localConfig: enigmaJS.IConfig = {
                    Promise: bluebird,
                    schema: qixSchema,
                    mixins: [exposeAppApi],
                    url: baseUrl,
                };

                let session: enigmaJS.ISession = enigma.create(localConfig);
                resolve(session);
            } catch (error) {
                reject(error);
            }
        });
    }
}