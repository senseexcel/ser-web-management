import { ITag } from '@core/api/tag.interface';
import { IDomainUser } from 'ser.api';

export class AppData {

    private appSettingsTag: ITag;

    private appUser: IDomainUser;

    public set tag(tag: ITag) {
        this.appSettingsTag = tag;
    }

    public get tag(): ITag {
        return this.appSettingsTag;
    }

    public set user(user: IDomainUser) {
        this.appUser = user;
    }

    public get user(): IDomainUser {
        return this.appUser;
    }
}
