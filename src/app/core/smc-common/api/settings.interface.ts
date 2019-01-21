import { ITag, ISessionUser } from '@smc/modules/qrs';

export interface ISettings {

    loggedInUser: ISessionUser;

    serTag: ITag;
}
