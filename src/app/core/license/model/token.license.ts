import { IValidationResult } from '../api';
import { AbstractLicense } from './license';

export class TokenLicense extends AbstractLicense {

    public toString(): string {
        return '';
    }

    public validate(): IValidationResult {
        return null;
    }
}
