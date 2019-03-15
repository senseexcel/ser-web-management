import { IUser, IUserLicense, IValidationResult } from '@smc/modules/license/api';

export class UserLicense implements IUserLicense {

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
}
