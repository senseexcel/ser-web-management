export enum ValidationStep {
    STEP_CONTENT_LIBRARY_EXISTS = 'content library "senseexcel" exists and have access rights',
    STEP_CONTENT_LIBRARY_ACCESS = 'can access content library',
    STEP_QLIK_LICENSE_ACCESS    = 'qlik license access',
    STEP_QLIK_LICENSE_VALID     = 'qlik license valid'
}

export interface ILicenseValidationResult {

    isValid: boolean;

    errors: string[];
}
