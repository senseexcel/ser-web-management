import { UserModel } from './user.model';

// hold multiple users
// fetch user by id ...
export class UserRepository {

    private qmcUsers: any;

    public set users(users: any) {
        this.qmcUsers = users;
    }

    public find(domainUser: string): UserModel {
        return new UserModel();
    }
}
