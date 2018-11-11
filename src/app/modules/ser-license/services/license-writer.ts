import { Injectable } from '@angular/core';
import { LicenseRepository } from './license-repository';
import { LicenseModel } from '../model/license.model';
import { Observable } from 'rxjs';

@Injectable()
export class LicenseWriter {

    private repository: LicenseRepository;

    constructor(
        repository: LicenseRepository
    ) {
        this.repository = repository;
    }

    /**
     * write data to license and upload to server
     *
     * @param {LicenseModel} model
     * @returns {Observable<string>}
     * @memberof LicenseWriter
     */
    public write(model: LicenseModel): Observable<string> {
        const raw = model.raw.replace(/\n/g, ' ');
        return this.repository.writeLicense(raw);
    }
}
