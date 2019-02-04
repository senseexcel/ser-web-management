export interface IQlikLicenseResponse {
    check: string;
    createdDate: string;
    expiredReason: string;
    id: string;
    isBlacklisted: boolean;
    isCloudServices: boolean;
    isElastic: boolean;
    isExpired: boolean;
    isInvalid: boolean;
    isSubscription: boolean;
    lef: string;
    modifiedByUserName: string;
    modifiedDate: string;
    name: string;
    numberOfCores: number;
    organization: string;
    privileges: any;
    product: number;
    schemaPath: string;
    serial: string;
}
