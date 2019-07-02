import { NgxFileuploadValidator, ValidationResult } from '@r-hannuschka/ngx-fileupload';

export class XlsxTypeValidator implements NgxFileuploadValidator {

    validate(file: File): ValidationResult {

        const allowed = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const isValid =  file.type === allowed;
        const error   =  !isValid ? 'Only Excel (.xlsx) files are allowed' : '';

        return { valid: isValid, error };
    }
}
