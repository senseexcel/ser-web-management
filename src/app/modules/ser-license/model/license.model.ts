import { ILicenseUser } from '../api/license-user.interface';

export class LicenseModel {

    /**
     * license serial number
     *
     * @private
     * @type {string}
     * @memberof LicenseModel
     */
    private licenseKey: string;

    /**
     * complete license as string
     *
     * @private
     * @type {string}
     * @memberof LicenseModel
     */
    private licenseRaw: string;

    /**
     * license core values
     *
     * @private
     * @type {string}
     * @memberof LicenseModel
     */
    private licenseText: string;

    /**
     * all users which are registered in license
     *
     * @private
     * @type {ILicenseUser[]}
     * @memberof LicenseModel
     */
    private licenseUsers: ILicenseUser[];

    /**
     * max users which can be active at the same time
     * -1 is unlimited user access
     *
     * @private
     * @type {number}
     * @memberof LicenseModel
     */
    private licenseUserLimit: number;

    public get key(): string {
        return this.licenseKey;
    }

    public get raw(): string {
        return this.licenseRaw;
    }

    public get text(): string {
        return this.licenseText;
    }

    public get users(): ILicenseUser[] {
        return this.licenseUsers;
    }

    public get userLimit(): number {
        return this.licenseUserLimit;
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

    public set users(users: ILicenseUser[]) {
        this.licenseUsers = users;
    }

    public set userLimit(limit: number) {
        this.licenseUserLimit = limit;
    }
}
