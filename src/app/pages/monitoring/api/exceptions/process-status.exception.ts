export class ProcessResponseException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ProcessResponseException.prototype);
    }
}
