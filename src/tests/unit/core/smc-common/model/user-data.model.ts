import { Validate, Validators } from '@smc/modules/smc-common/utils/model/validate-property.decorator';
export class UserDataModel {

    private userName: string;

    public isValid: boolean;

    public constructor() {
        this.isValid = false;
    }

    @Validate<string>([
        Validators.Required,
        Validators.isString,
        Validators.NotEmpty,
    ])
    public set name(name: string) {
        this.userName = name;
    }

    public get name(): string {
        return this.userName;
    }
}
