import { IFormResponse, IFormData } from '@smc/modules/form-helper/api/response.interface';

export interface ISerReportFormGroup {

    group: string;

    path: string;

    fields: IFormData;
}

export interface ISerFormResponse extends IFormResponse {

    skip?: boolean;

    data?: ISerReportFormGroup[];
}
