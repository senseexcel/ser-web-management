export class NotAllocatedException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, NotAllocatedException.prototype);
    }
}
