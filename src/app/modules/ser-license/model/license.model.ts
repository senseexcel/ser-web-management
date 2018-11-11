export class LicenseModel {

    private licenseKey: string;

    private licenseUsers: string[];

    private licenseRaw: string;

    public get key(): string {
        return this.licenseKey;
    }

    public get raw(): string {
        return this.licenseRaw;
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

    public set users(users: string[]) {
        this.licenseUsers = users;
    }
}
