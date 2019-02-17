import { InjectionToken } from '@angular/core';
import { IDomainUser } from 'ser.api';
import { ITag } from '@smc/modules/qrs';

class SmcSession {

    private static readonly instance: SmcSession = new SmcSession();

    private user: IDomainUser;

    private tag: ITag;

    public static getInstance() {
        return this.instance;
    }

    public constructor() {
        if (SmcSession.instance) {
            throw new Error('could not create instance of SmcSettings, use getInstance instead!');
        }
    }

    public set loggedInUser(user: IDomainUser) {
        this.user = user;
    }

    public get loggedInUser(): IDomainUser {
        return this.user;
    }

    public set serTag(tag: ITag) {
        this.tag = tag;
    }

    public get serTag(): ITag {
        return this.tag || null;
    }
}

export const SMC_SESSION = new InjectionToken('SmcSession', {
    factory: () => {
        return SmcSession.getInstance();
    }
});
