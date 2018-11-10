export class LicenseInstallationInvalidException extends Error {

    private exceptionErrors: string[];

    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, LicenseInstallationInvalidException.prototype);
    }

    public set errors(errors: string[]) {
        this.exceptionErrors = errors;
    }

    public get errors(): string[] {
        return this.exceptionErrors;
    }
}
