import { IValidationResult } from '@smc/modules/license/api';
import { AbstractLicense } from '@smc/modules/license/model';

export class LicenseMock extends AbstractLicense {

    public toString(): string {
        return '';
    }

    public validate(): IValidationResult {
        return null;
    }
}
