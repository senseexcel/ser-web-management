import { ReplaySubject, Subject } from 'rxjs';
import { IValidationResult, ILicense } from '@smc/modules/license/api';
import { IQlikLicense } from '../api/qlik-license.interface';

export class LicenseSource {

    public changed$: ReplaySubject<ILicense>;

    public validate$: Subject<IValidationResult>;

    private _qlikLicense: IQlikLicense;

    private _validationResult: IValidationResult;

    private _license: ILicense;

    public constructor() {
        this.changed$ = new ReplaySubject(1);
        this.validate$ = new Subject();
    }

    public set license(license: ILicense) {
        if (license !== this._license) {
            this._validationResult = license.validate();
            this._license = license;
            this.changed$.next(license);
        }
    }

    public get license(): ILicense {
        return this._license;
    }

    public set qlikLicense(key: IQlikLicense) {
        this._qlikLicense = key;
    }

    public get qlikLicense(): IQlikLicense {
        return this._qlikLicense;
    }

    public get isValid(): boolean {
        return this._validationResult.isValid;
    }

    public get validationResult(): IValidationResult {
        return this._validationResult;
    }

    public revalidateSource() {
        this._validationResult = this._license.validate();
        this.validate$.next(this._validationResult);
    }
}
