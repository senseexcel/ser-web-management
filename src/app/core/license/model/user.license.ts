import { IUser, IUserLicense, IValidationResult } from '../api';
import { License } from './license';
import { UserLicenseValidator } from '../validators/user.validator';

export class UserLicense extends License implements IUserLicense {

    private _userLimit;

    private _users: Set<IUser>;

    private validator: UserLicenseValidator;

    public constructor() {
        super();
        this.validator = new UserLicenseValidator();
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
     * @memberof UserLicense
     */
    public get userLimit(): number {
        return this._userLimit;
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
        return '';
    }

    public validate(): IValidationResult {
        return this.validator.validate(this);
    }
}
