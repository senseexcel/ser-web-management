import { ILicense } from '@smc/modules/license/api';
import { ReplaySubject } from 'rxjs';

export class LicenseSource {

    public changed$: ReplaySubject<ILicense>;

    public constructor() {
        this.changed$ = new ReplaySubject(1);
    }

    public set license(license: ILicense) {
        this.changed$.next(license);
    }
}
