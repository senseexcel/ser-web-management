import { Validate, Validators } from '@smc/modules/smc-common/utils/model/validate-property.decorator';
import { DataModel } from '@smc/modules/smc-common/utils/model/data-model.decorator';

interface IModelValidator {
    onModelValidationChange(isValid: boolean): void;
}

@DataModel
export class UserDataModel implements IModelValidator {

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

    onModelValidationChange(isValid: boolean): void {
    }
}
