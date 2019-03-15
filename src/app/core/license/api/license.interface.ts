import { IValidationResult } from './validation-result.interface';
import moment = require('moment');

export interface ILicense {

    licenseData: string[];

    licenseKey: string;

    from: moment.Moment;

    to: moment.Moment;

    data: string[];

    validate(): IValidationResult;
}
