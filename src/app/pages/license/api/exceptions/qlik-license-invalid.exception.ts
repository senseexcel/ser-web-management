export class QlikLicenseInvalidException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, QlikLicenseInvalidException.prototype);
    }
}
