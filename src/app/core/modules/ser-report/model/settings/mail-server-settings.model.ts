import { IMailServerSettings } from 'ser.api';

export class MailServerSettingsModel implements IMailServerSettings {

    private mailServerSettingsHost: string;
    private mailServerSettingsFrom: string;
    private mailServerSettingsPort: number;
    private mailServerSettingsUsername: string;
    private mailServerSettingsPassword: string;
    private mailServerSettingsUseSsl: boolean;

    public get host(): string {
        return this.mailServerSettingsHost;
    }

    public get from(): string {
        return this.mailServerSettingsFrom;
    }

    public get port(): number {
        return this.mailServerSettingsPort;
    }

    public get password(): string {
        return this.mailServerSettingsPassword;
    }

    public get username(): string {
        return this.mailServerSettingsUsername;
    }

    public get useSsl(): boolean {
        return this.mailServerSettingsUseSsl;
    }

    public set host(host: string) {
        this.mailServerSettingsHost = host;
    }

    public set from(from: string) {
        this.mailServerSettingsFrom = from;
    }

    public set port(port: number) {
        this.mailServerSettingsPort = port;
    }

    public set username(username: string) {
        this.mailServerSettingsUsername = username;
    }

    public set password(password: string) {
        this.mailServerSettingsPassword = password;
    }

    public set useSsl(useSsl: boolean) {
        this.mailServerSettingsUseSsl = useSsl;
    }
}
