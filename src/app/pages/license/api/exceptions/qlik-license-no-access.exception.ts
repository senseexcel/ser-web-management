export class QlikLicenseNoAccessException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, QlikLicenseNoAccessException.prototype);
    }
}
