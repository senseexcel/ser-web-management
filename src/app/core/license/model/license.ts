import { ILicense, IValidationResult, LicenseType } from '../api';
import { Moment } from 'moment';

export abstract class AbstractLicense implements ILicense {

    readonly licenseType: LicenseType;

    private _licenseData: string[] = [];

    private _licenseKey = '';

    private _from: Moment;

    private _to: Moment;

    private _data: string[] = [];

    /**
     * set additional data on license
     */
    public set data(data: string[]) {
        this._data = data;
    }

    /**
     * get additional data on license
     */
    public get data(): string[] {
        return this._data;
    }

    /**
     * set license informations
     */
    public set licenseData(lines: string[]) {
        this._licenseData = lines;
    }

    /**
     * get license informations
     */
    public get licenseData(): string[] {
        return this._licenseData;
    }

    /**
     * get license key
     */
    public set licenseKey(key: string) {
        this._licenseKey = key;
    }

    /**
     * set license key
     */
    public get licenseKey(): string {
        return this._licenseKey;
    }

    /**
     * public set active from
     */
    public set from(from: Moment) {
        this._from = from;
    }

    /**
     * get license active from
     */
    public get from(): Moment {
        return this._from;
    }

    /**
     * set string license is activad until
     */
    public set to(to: Moment) {
        this._to = to;
    }

    /**
     * get string license is actived until
     */
    public get to(): Moment {
        return this._to;
    }

    public toString() {
        return [
            ...this.licenseData,
            ...this.data
        ].join('\n');
    }

    public abstract validate(): IValidationResult;
}
