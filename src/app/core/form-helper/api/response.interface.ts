export interface IFormData {
    [key: string]: IFormData;
}

export interface IFormResponse {

    errors: [];

    valid: boolean;
}
