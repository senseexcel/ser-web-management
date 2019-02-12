import { ILicenseUser } from '../api/license-user.interface';
import { ILicenseValidationResult } from '../api/validation-result.interface';

export class LicenseModel {

    private licenseKey: string;
    private licenseRaw: string;
    private licenseText: string;
    private licenseUsers: ILicenseUser[];
    private licenseUserLimit: number;
    private licenseValidationResult: ILicenseValidationResult;

    public set validationResult(result: ILicenseValidationResult) {
        this.licenseValidationResult = result;
    }

    public get validationResult(): ILicenseValidationResult {
        return this.licenseValidationResult;
    }

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
