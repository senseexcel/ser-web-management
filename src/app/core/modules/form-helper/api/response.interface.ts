export interface IFormFieldData {
    name: string;
    valid: boolean;
    value: any;
}

export interface IFormGroupData {
    name: string;
    fields?: IFormFieldData[];
}

export interface IFormResponse {

    data?: IFormGroupData[];

    errors: [];

    valid: boolean;
}
