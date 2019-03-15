export class ValidationToken {
    public constructor(name: string) {}
}

/** license validation tokens */
export const licensNotActiveError    = new ValidationToken('license not active yet');
export const licenseExpiredTimeError = new ValidationToken('license allready expired');

/** user validation tokens */
export const toManyUsersActivatedError = new ValidationToken('to many users uses the licenes on the same time');
