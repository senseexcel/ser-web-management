export class LicenseModel {

    private licenseKey: string;

    private licenseRaw: string;

    private licenseText: string;

    private licenseUsers: string[];

    public get key(): string {
        return this.licenseKey;
    }

    public get raw(): string {
        return this.licenseRaw;
    }

    public get text(): string {
        return this.licenseText;
    }

    public get users(): string[] {
        return this.licenseUsers;
    }

    public set key(key: string) {
        this.licenseKey = key || '';
    }

    public set raw(raw: string) {
        this.licenseRaw = raw;
    }

    public set text(text: string) {
        this.licenseText = text;
    }

    public set users(users: string[]) {
        this.licenseUsers = users;
    }
}
