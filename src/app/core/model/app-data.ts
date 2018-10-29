import { ITag } from '@core/api/tag.interface';
import { IDomainUser } from 'ser.api';
import { ISessionUser } from '@core/api/session-user.interface';

export class AppData {

    private appSettingsTag: ITag;

    private appUser: ISessionUser;

    public set tag(tag: ITag) {
        this.appSettingsTag = tag;
    }

    public get tag(): ITag {
        return this.appSettingsTag;
    }

    public set user(user: ISessionUser) {
        this.appUser = user;
    }

    public get user(): ISessionUser {
        return this.appUser;
    }
}
