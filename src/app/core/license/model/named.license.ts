import { IUser, IUserLicense, IValidationResult, LicenseType } from '../api';
import { AbstractLicense } from './license';
import { NamedLicenseValidator } from '../validators/user.validator';
import { NamedLicenseWriter } from '../writer/named-license.writer';

export class NamedLicense extends AbstractLicense implements IUserLicense {

    private _userLimit;

    private _users: Set<IUser>;

    public constructor() {
        super();
        this._users = new Set();
        this.validator = new NamedLicenseValidator();
        this.writer    = new NamedLicenseWriter();
    }

    /**
     * set user limit
     */
    public set userLimit(limit: number) {
        this._userLimit = limit;
    }

    /**
     * get user limitation for license
     *
     * @type {number}
     * @memberof NamedLicense
     */
    public get userLimit(): number {
        return this._userLimit;
    }

    public get licenseType(): LicenseType {
        return LicenseType.NAMED;
    }

    /**
     * get all users from license
     */
    public get users(): IUser[] {
        return Array.from(this._users);
    }

    /**
     * add single user
     */
    public addUser(user: IUser) {
        this._users.add(user);
    }

    /**
     * add multiple users
     */
    public addUsers(users: IUser[]) {
        users.forEach((user: IUser) => this.addUser(user));
    }

    /**
     * remove single user from users
     */
    public removeUser(user: IUser) {
        this._users.delete(user);
    }

    /**
     * remove multiple users
     */
    public removeUsers(users: IUser[]) {
        users.forEach((user: IUser) => this.removeUser(user));
    }

    public toString(): string {
        return this.writer.write(this);
    }

    public validate(): IValidationResult {
        return this.validator.validate(this);
    }
}
