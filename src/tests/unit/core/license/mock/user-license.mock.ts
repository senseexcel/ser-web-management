import { IUser, IUserLicense, IValidationResult, LicenseType } from '@smc/modules/license/api';
import { Moment } from 'moment';
import moment from 'moment';

export class NamedLicense implements IUserLicense {

    licenseType: LicenseType = LicenseType.NAMED;

    licenseData: string[];

    licenseKey: string;

    from: Moment;

    to: Moment;

    data: string[];

    public constructor() {
        this.from = moment();
        this.to   = moment(this.from).add(6, 'months');
    }

    private _users: IUser[] = [];

    private _userLimit: number;

    public addUser(user: IUser)  {
        this._users.push(user);
    }

    public addUsers(users: IUser[])  {
        this._users.push(...users);
    }

    public get users(): IUser[] {
        return this._users;
    }

    public set userLimit(limit: number) {
        this._userLimit = limit;
    }

    public get userLimit(): number {
        return this._userLimit;
    }

    public validate(): IValidationResult {
        return null;
    }

    removeUser(user: IUser) {
        /* noop */
    }

    removeUsers(user: IUser[]) {
        /** noop */
    }

    toString(): string {
        return '';
    }
}
