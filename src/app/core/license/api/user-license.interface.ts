import { IUser } from './user.interface';
import { ILicense } from './license.interface';

export interface IUserLicense extends ILicense {

    userLimit: number;

    readonly users: IUser[];

    addUser(user: IUser);

    addUsers(user: IUser[]);
}
