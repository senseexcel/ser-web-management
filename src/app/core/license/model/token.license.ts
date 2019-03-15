import { Observable } from 'rxjs';
import { IValidationResult } from '../api';
import { License } from './license';

export class TokenLicense extends License {

    public toString(): string {
        return '';
    }

    public validate(): IValidationResult {
        return null;
    }
}
