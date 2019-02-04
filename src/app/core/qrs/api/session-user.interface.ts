import { IDomainUser } from 'ser.api';

export interface ISessionUser extends IDomainUser {

    logoutUri: string;

    userName: string;
}
