import { IUser, IUserLicense, IValidationResult } from '../api';
import { License } from './license';

export class UserLicense extends License implements IUserLicense {

    private _userLimit;

    private _users: IUser[];

    public get userLimit(): number {
        return this._userLimit;
    }

    public get users(): IUser[] {
        return this._users;
    }

    public toString(): string {
        return '';
    }

    public addUser(user: IUser) {
    }

    public addUsers(user: IUser[]) {
    }

    public validate(): IValidationResult {
        return null;
    }
}
