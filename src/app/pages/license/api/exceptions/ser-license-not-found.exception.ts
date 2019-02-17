export class SerLicenseNotFoundException extends Error {
    constructor(m = 'license not found') {
        super(m);
        Object.setPrototypeOf(this, SerLicenseNotFoundException.prototype);
    }
}
