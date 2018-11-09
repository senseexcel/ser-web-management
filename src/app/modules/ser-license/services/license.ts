import { Injectable } from '@angular/core';
import { LicenseModel } from '../model/license.model';
import { Observable, of } from 'rxjs';
import { LicenseRepository } from './license-repository';

@Injectable()
export class License {

    private licenseModel: LicenseModel;

    private repository: LicenseRepository;

    constructor(
        repository: LicenseRepository
    ) {
        this.repository = repository;
    }

    /**
     * load license
     *
     * @memberof License
     */
    public loadLicense(): Observable<any> {
        // licenseRepository

        return of('');
    }

    public updateLicense(content: string) {
        // notify observer license has been updated
    }
}
