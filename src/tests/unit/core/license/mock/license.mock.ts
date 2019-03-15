import { IValidationResult } from '@smc/modules/license/api';
import { License } from '@smc/modules/license/model';

export class LicenseMock extends License {

    public toString(): string {
        return '';
    }

    public validate(): IValidationResult {
        return null;
    }
}
