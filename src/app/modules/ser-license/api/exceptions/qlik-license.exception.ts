export class InvalidQlikLicenseException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, InvalidQlikLicenseException.prototype);
    }
}
