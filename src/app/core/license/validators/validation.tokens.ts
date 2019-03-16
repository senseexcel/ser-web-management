export class ValidationToken {
    public constructor(name: string) { }
}

/** reader could not parse license correctly, so this is a broken license file */
export const licenseBrokenError = new ValidationToken('invalid license file');

/** license validation tokens */
export const licenseNotActiveYetError = new ValidationToken('license not active yet');
export const licenseExpiredError = new ValidationToken('license allready expired');

/** user validation tokens */
export const toManyUsersAtSameDateError = new ValidationToken('to many users uses the licenes on the same time');
