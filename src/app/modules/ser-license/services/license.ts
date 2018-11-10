import { Injectable } from '@angular/core';
import { LicenseModel } from '../model/license.model';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { LicenseRepository } from './license-repository';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { LicenseReader } from './license-reader';

@Injectable()
export class License {

    public update$: Subject<LicenseModel>;

    public license$: BehaviorSubject<LicenseModel>;

    private reader: LicenseReader;

    private repository: LicenseRepository;

    constructor(
        reader: LicenseReader,
        repository: LicenseRepository,
    ) {
        this.reader          = reader;
        this.repository      = repository;
        this.license$         = new BehaviorSubject(new LicenseModel());

        this.update$ = new Subject();
    }

    /**
     * load license
     *
     * @memberof License
     */
    public loadLicense(): Observable<LicenseModel> {

        return this.repository.readLicense().pipe(
            map((licenseContent: string): LicenseModel => {
                const license = this.reader.read(licenseContent);
                this.license$.next(license);
                return license;
            }),
            catchError(() => {
                return of(new LicenseModel());
            })
        );
    }

    public updateLicense(content: string) {
        // license has been updated
        // upload license
        // after that read license
    }

    public saveLicense(license: LicenseModel) {
        // call writer to create license raw data
        // send raw data to save it
    }
}
