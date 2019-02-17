export class ProcessStatusException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ProcessStatusException.prototype);
    }
}
