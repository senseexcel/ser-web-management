import { IFormResponse, IFormData } from '@core/modules/form-helper';

export interface ISerReportFormGroup {

    group: string;

    path: string;

    fields: IFormData;
}

export interface ISerFormResponse extends IFormResponse {

    data?: ISerReportFormGroup[];
}
