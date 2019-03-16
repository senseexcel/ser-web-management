import { IValidationResult } from './validation-result.interface';
import moment = require('moment');
import { LicenseType } from './license-type.interface';

export interface ILicense {

    licenseData: string[];

    licenseKey: string;

    readonly licenseType: LicenseType;

    from: moment.Moment;

    to: moment.Moment;

    data: string[];

    validate(): IValidationResult;
}
