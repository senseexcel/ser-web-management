interface ErrorResponse {
    status: number;

    error: string;
}

export class SerLicenseResponseException extends Error {

    private errorResponse: ErrorResponse;

    constructor(data: ErrorResponse, m = 'license not found') {
        super(m);
        this.errorResponse = data;
        Object.setPrototypeOf(this, SerLicenseResponseException.prototype);
    }

    public get response(): ErrorResponse {
        return this.errorResponse;
    }
}
