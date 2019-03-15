import { ValidationToken } from '../validators/validation.tokens';

export interface IValidationResult {

    isValid: boolean;

    errors: WeakSet<ValidationToken>;
}
