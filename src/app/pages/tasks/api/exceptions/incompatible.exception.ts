export class TaskIncomatibleException extends Error {

    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, TaskIncomatibleException.prototype);
    }
}
