export class ContentLibNotExistsException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ContentLibNotExistsException.prototype);
    }
}
