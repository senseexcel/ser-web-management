export class ValidationToken {
    public constructor(name: string) { }
}

/** license validation tokens */
export const licenseNotActiveYetError = new ValidationToken('license not active yet');
export const licenseExpiredError = new ValidationToken('license allready expired');

/** user validation tokens */
export const toManyUsersAtSameTimeError = new ValidationToken('to many users uses the licenes on the same time');
