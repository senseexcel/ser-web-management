export class User {

    private userDomain: string;

    private userId: string;

    private userActiveFrom: Date;

    private userActiveTo: Date;

    public set domain(domain: string) {
        this.userDomain = domain;
    }

    public set id(id: string) {
        this.userId = id;
    }

    public set from(from: Date) {
        this.userActiveFrom = from;
    }

    public set to(to: Date) {
        this.userActiveTo = to;
    }

    public get domain(): string {
        return this.userDomain;
    }

    public get id(): string {
        return this.userId;
    }

    public get from(): Date {
        return this.userActiveFrom;
    }

    public get to(): Date {
        return this.userActiveTo;
    }
}
