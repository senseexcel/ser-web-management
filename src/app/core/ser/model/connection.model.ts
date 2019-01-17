import { ISerConnection, ISerCredentials, ISerThumbprint } from 'ser.api';

export class ConnectionModel implements ISerConnection {

    private connectionApp: string;
    private connectionCredentials: ISerCredentials;
    private connectionLefs: string[];
    private connectionServerUri: string;
    private connectionSharedSession: boolean;
    private connectionSslValidThumbprints: ISerThumbprint[];
    private connectionSslVerify: boolean;

    public set app(app: string) {
        this.connectionApp = app;
    }

    public set credentials(credentials: ISerCredentials) {
        this.connectionCredentials = credentials;
    }

    public set lefs(lefs: string[]) {
        this.connectionLefs = lefs;
    }

    public set serverUri(uri: string) {
        this.connectionServerUri = uri;
    }

    public set sharedSession(shared: boolean) {
        this.connectionSharedSession = shared;
    }

    public set sslValidThumbprints(thumbprints: ISerThumbprint[]) {
        this.connectionSslValidThumbprints = thumbprints;
    }

    public set sslVerify(verify: boolean) {
        this.connectionSslVerify = verify;
    }

    public get app(): string {
        return this.connectionApp;
    }

    public get credentials(): ISerCredentials {
        return this.connectionCredentials;
    }

    public get lefs(): string[] {
        return this.connectionLefs;
    }

    public get serverUri(): string {
        return this.connectionServerUri;
    }

    public get sharedSession(): boolean {
        return this.connectionSharedSession;
    }

    public get sslValidThumbprints(): ISerThumbprint[] {
        return this.connectionSslValidThumbprints;
    }

    public get sslVerify(): boolean {
        return this.connectionSslVerify;
    }

    public get raw(): ISerConnection {
        return {
            app: this.connectionApp,
            credentials: this.connectionCredentials,
            lefs: this.connectionLefs,
            serverUri: this.connectionServerUri,
            sslValidThumbprints: this.connectionSslValidThumbprints,
            sslVerify: this.connectionSslVerify,
        };
    }
}
