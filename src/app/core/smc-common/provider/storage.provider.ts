export enum SerStorageKey {
    MODAL_SER_TAG_MISSING = 'displayModalSerTagMissing',
}

import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    private storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    /**
     * set value into storage
     *
     * @param {SerStorageKey} key
     * @param {string} value
     * @memberof NameService
     */
    public write(key: SerStorageKey, value: string | boolean) {
        this.storage.setItem(key, String(value));
    }

    /**
     * read value from storage
     *
     * @param {SerStorageKey} key
     * @returns {string}
     * @memberof NameService
     */
    public read(key: SerStorageKey): string | boolean {
        const data = this.storage.getItem(key);
        if ( data === 'true' || data === 'false') {
            return data === 'true' || false;
        }
        return data;
    }

    /**
     * delete item from storage
     *
     * @param {*} key
     * @memberof NameService
     */
    public delete(key): void {
        this.storage.removeItem(key);
    }
}
