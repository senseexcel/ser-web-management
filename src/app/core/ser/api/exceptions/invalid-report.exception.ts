export class InvalidReportException extends Error {

    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, InvalidReportException.prototype);
    }
}
