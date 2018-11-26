import { Observable, of } from 'rxjs';

export enum SerialNumbers {
    Qlik = 'my-qlik-serial-number',
}

export class LicenseRepositoryMock {

    public fetchQlikSerialNumber(): Observable<string> {
        return of(SerialNumbers.Qlik);
    }
}
